// Film 28 · "They're Using AI to Save the World" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText, the 2.5D card stage cam3/card/aim/camAt/camDrift, counter,
// finish) + lib/f16_kit.mjs (rise, maskLine, measure, rule, quote, stamp, chatUI). World: docs/MOTION.md §2. Shots: docs/shots.md.
//
//   THE AIM (the through-line): the A.I. is a cool bead with a slow ring (agent). It is a TOOL: it does what it is pointed at. Its thin
//   beam (beam) is cool along its length; where it lands on something worth saving the light turns WARM. "It was the aim."
//   THE TREE (the guiding image = thumbnail A, ANCHORS ONLY: hook, the turn after No. 8, the question before No. 1, the ending):
//   a giant tree on a hill at night, the crown lit gold from inside (o.glow), you (yellow coat) tiny at its foot. Along its lowest limb
//   hang TWELVE LANTERNS, No. 12 at the tip … No. 1 near the trunk: the countdown as an object. Lanterns are windows into scenes.
//   THE LAMP RAIL (the countdown on screen, NOT a clock, NO big numbers): twelve mini lanterns top left (12 … 1). A lamp lights only on
//   its station's SOLUTION (LAMPS[].solve), never at the start; No. 8 lights only half (most alerts unanswered). Under each lamp its
//   TOOL OBJECT hangs once the station shows it (LAMPS[].toolAt): the gallery of "what it was built for" that the ending resolves.
//   EXPLAINERS (60–70 %): made of film things — the bead and its beam, light lines, dot fields, slabs, serif numbers, tags, cards.
//
// API (design px = screen px at the home camera; t in seconds; u = 0..1 growth):
//   colours: WARM, COOL, INK · PRINT28 (finish) · bump(t, t0, d)
//   world:   sky(ctx, c, t, o) · plain(ctx, c, t, o) · pool(ctx, x, y, rx, ry, a, col) · hills(ctx, pts, o) · water(ctx, x0, x1, y, h, t, o)
//   agent(ctx, t, x, y, r, o { a, think, ring })  the machine (cool bead, never a robot, never a brain)
//   beam(ctx, t, x0, y0, x1, y1, u, o { w, a, hit 0..1 (warm splash at the target), warm 0..1 (the beam itself warms), spark })
//   coolPath(ctx, pts, u0, u1, w, a) · camPath(t, K)
//   TREE (geometry) · tree(ctx, t, o { glow 0..1, x, y, s, front: true|false|'only', lantern: (n) → lantern options }) · treeLantern(n) → {x, y, len}
//   lantern(ctx, t, x, y, s, o { lit 0..1, len, swing, inside(ctx, w, h) (local 1000-wide space), glass, a, cap }) → glass rect
//   LAMPS (n, solve, tool, toolAt, half) · lampOn(T, n, t) → 0..1 · lampRail(ctx, t, T, o { a, from(n) → [x, y, s], m 0..1, big })
//   TOOLS · toolPath(name) · tool(ctx, name, x, y, s, o { a, lit, col }) · tag(ctx, t, x, y, text, u, o { swing, size, col })
//   laptop(ctx, t, x, y, s, o { open, screen(ctx, w, h), glow }) · voiceWave(ctx, t, x, y, s, o { a, col, ph }) · radioRings(ctx, t, x, y, r, o)
//   realStamp(ctx, t, t0, t1, key | st, o { x, y, size, screen }) · STAMPS · SOURCES · QUOTES · source(ctx, t, t0, t1, s)
//   chartLines · slab / slabBars · dotField(ctx, t, o) · ruler(ctx, t, o) · dayTiles · bracket · label · questionMark(ctx, t, x, y, s, u)
//   CLIP_RECT, CLIPS, clipWin, prepareClipFrames, clipPlate(ctx, t, T, id, o { from: [cx, cy, r] | { x, y, w, h }, morph, dark })
//   thesis(ctx, t, x, y, u, o { lines, size, out }) the thumbnail line (Inter 600 caps, cream glow)
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D, PathOp, loadImage } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, quote, rule, maskLine, measure, stamp, chatUI } = K16;
export const { du, person, cam3, card, camAt, camDrift, aim, project, F0, glowText, counter, withOuter, lightFlood, catmull, trail, dust } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };

export const PRINT28 = { grain: 14, floor: 4, vig: .5 };
// colour code (docs/MOTION.md §5): WARM = people, what is saved, the hero light · COOL = the machine (the bead, its beam) · INK = night forms
export const WARM = { core: P.core0, body: P.halo0, deep: P.shade0, line: mixHex(P.halo0, P.coat, .25), text: P.halo2 };
export const COOL = { core: '#f2f8ff', body: mixHex(P.cream, '#9fc2ee', .55), deep: mixHex(P.blue0, P.blue1, .5), line: mixHex(P.cream, '#9fc2ee', .4), halo: '#7fa6e6', text: mixHex(P.cream, '#9fc2ee', .35) };
export const INK = { far: mixHex(P.ind0, P.blue0, .35), mid: mixHex(P.night1, P.ind1, .6), near: P.night1, deep: P.night0, rim: mixHex(P.halo2, P.blue1, .35), leaf: mixHex(P.ind1, P.blue0, .3) };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const TAU = Math.PI * 2;

// ======================================================================================================================== WORLD
export const Z_SKY = 40000, Z_HOR = 9000, HOR = 800;
// the night sky (screen) + stars on a far card + a soft blue glow. o { glow: [x, y, r] (design, F0), stars 0..1, hor (design y of the horizon) }
export function sky(ctx, c, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const hy = (E.project(c, Z_HOR, 0, o.hor ?? HOR) || [0, H * .75])[1];
  ctx.fillStyle = lin(ctx, 0, hy - 1100, 0, hy, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue0, .35)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  E.card(ctx, c, Z_SKY, () => E.stars(ctx, 28, 900, t, [-6000, -5200, 16000, 6200], o.stars ?? 1));
  if (o.glow) E.card(ctx, c, F0 * 2.2, () => halo(ctx, o.glow[0], o.glow[1], o.glow[2], .3, P.blue0, mixHex(P.blue0, P.halo2, .35)));
}
// the plain: ground from the horizon down, a faint blue rim on the horizon. Returns the horizon's screen y.
export function plain(ctx, c, t, o = {}) {
  const hy = (E.project(c, Z_HOR, 0, o.hor ?? HOR) || [0, H * .75])[1];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, hy, 0, Math.max(hy + 10, H), [[0, mixHex(P.night1, P.ind0, .5)], [.25, P.night1], [1, P.night0]]); ctx.fillRect(0, hy, W, H - hy + 2);
  ctx.strokeStyle = rgba(P.blue0, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(W, hy); ctx.stroke();
  ctx.restore();
  return hy;
}
// a warm pool of light on the ground (design coords on the current card)
export function pool(ctx, x, y, rx, ry, a = 1, col = WARM) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
  ctx.fillStyle = rad(ctx, 0, 0, rx, [[0, rgba(col.body, .5 * a)], [.35, rgba(col.body, .2 * a)], [1, rgba(col.body, 0)]]); ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
}
// a hill / land silhouette through points (smooth), filled down to y + 2000, a lit rim (o.rim colour, o.rimA) and a vertical grain gradient
export function hills(ctx, pts, o = {}) {
  const p = new Path2D(), q = E.catmull(pts.map((v) => [v[0], v[1]]), 10);
  p.moveTo(q[0][0], q[0][1] + 3000); q.forEach((v) => p.lineTo(v[0], v[1])); p.lineTo(q[q.length - 1][0], q[q.length - 1][1] + 3000); p.closePath();
  const top = Math.min(...pts.map((v) => v[1]));
  ctx.fillStyle = lin(ctx, 0, top, 0, top + (o.depth ?? 500), [[0, o.top ?? INK.mid], [1, o.bottom ?? INK.deep]]); ctx.fill(p);
  if ((o.rimA ?? .5) > 0) { ctx.save(); ctx.strokeStyle = rgba(o.rim ?? P.blue0, o.rimA ?? .5); ctx.lineWidth = o.rimW ?? 2.5; ctx.beginPath(); q.forEach((v, i) => (i ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1]))); ctx.stroke(); ctx.restore(); }
  return p;
}
// still water between x0 and x1 from y (surface) down h: a dark gradient, a warm (or cool) reflection column at o.rx, slow ripple dashes
export function water(ctx, x0, x1, y, h, t, o = {}) {
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, o.top ?? mixHex(P.ind0, P.blue0, .3)], [1, o.bottom ?? P.night0]]); ctx.fillRect(x0, y, x1 - x0, h);
  if (o.rx != null) {
    const rw = o.rw ?? 160, col = o.col ?? P.halo0, a = o.a ?? .8;
    for (let k = 0; k < 14; k++) {
      const yy = y + 6 + k * (h / 15), ww = rw * (1 - k / 18) * (.7 + .3 * Math.sin(t * .9 + k * 1.7)), xx = o.rx + 10 * Math.sin(t * .6 + k);
      ctx.fillStyle = rgba(col, a * (1 - k / 15) * .7); ctx.fillRect(xx - ww / 2, yy, ww, Math.max(2, h / 60));
    }
  }
  ctx.strokeStyle = rgba(P.blue0, .35); ctx.lineWidth = 2;
  const r = prng(o.seed ?? 5);
  for (let k = 0; k < 22; k++) { const yy = y + 10 + r() * h * .9, xx = x0 + r() * (x1 - x0), w = 40 + r() * 120, dx = 18 * Math.sin(t * .3 + k); ctx.beginPath(); ctx.moveTo(xx + dx, yy); ctx.lineTo(xx + dx + w, yy); ctx.stroke(); }
}

// ======================================================================================================================== THE AGENT + THE AIM
// the machine: a cool bead of light with a slow dashed ring (machine = circle). o { a, think 0..1 (rings pulse inward), ring 0..1 }
export function agent(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= .3) return;
  halo(ctx, x, y, r * 6, .28 * a, COOL.halo, COOL.body);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rad(ctx, x - r * .25, y - r * .3, r * 1.2, [[0, COOL.core], [.55, COOL.body], [1, COOL.deep]]); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  const ring = o.ring ?? 1;
  if (ring > 0) {
    ctx.strokeStyle = rgba(COOL.line, .7 * ring); ctx.lineWidth = Math.max(1, r * .14); ctx.setLineDash([r * .9, r * .5]); ctx.lineDashOffset = -t * r * 2.2;
    ctx.beginPath(); ctx.arc(x, y, r * 1.75, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  }
  if (o.think) for (let k = 0; k < 2; k++) { const u = ((t * .8 + k * .5) % 1); ctx.strokeStyle = rgba(COOL.line, .5 * o.think * u); ctx.lineWidth = Math.max(1, r * .1); ctx.beginPath(); ctx.arc(x, y, r * (1.2 + 1.8 * (1 - u)), 0, TAU); ctx.stroke(); }
  ctx.restore();
}
// THE AIM: the bead's thin beam from (x0, y0) toward (x1, y1), drawn to fraction u. Cool along its length; o.warm 0..1 warms the whole
// beam (a beam that serves people); o.hit 0..1 = the warm splash where it lands. Returns the head [x, y].
export function beam(ctx, t, x0, y0, x1, y1, u, o = {}) {
  u = clamp(u); if (u <= 0 || (o.a ?? 1) <= 0) return null;
  const a = o.a ?? 1, w = o.w ?? 3, hx = lerp(x0, x1, u), hy = lerp(y0, y1, u), wm = clamp(o.warm ?? 0);
  const body = mixHex(COOL.body, P.halo0, wm), glow = mixHex(COOL.halo, P.halo1, wm);
  ctx.save(); ctx.lineCap = 'round'; ctx.globalAlpha *= a;
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = lin(ctx, x0, y0, hx, hy, [[0, rgba(glow, .05)], [1, rgba(glow, .35)]]); ctx.lineWidth = w * 6; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = lin(ctx, x0, y0, hx, hy, [[0, rgba(body, .25)], [1, rgba(mixHex(body, P.cream, .4), .95)]]); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.restore();
  const hit = clamp(o.hit ?? 0);
  if (u < 1 && o.spark !== false) halo(ctx, hx, hy, w * 10, .7 * a, wm > .5 ? P.halo0 : COOL.halo, wm > .5 ? P.core0 : COOL.core);
  if (hit > 0) { halo(ctx, x1, y1, (o.hitR ?? w * 40) * (.4 + .6 * expoOut(hit)), .85 * a * hit, P.halo0, P.core0); E.dust(ctx, 83, 90, x1, y1, (o.hitR ?? w * 40) * .5, (o.hitR ?? w * 40) * .35, t, .7 * a * hit); }
  return [hx, hy];
}

// ======================================================================================================================== THE TREE
// The giant tree of thumbnail A, in TREE-WORLD design px (the home camera cam3() = the thumbnail view: trunk right of centre, the crown
// filling the upper right, you at its foot). Drawn on the F0 card. Static paths are built once (seeded), the light is per frame.
//   o.glow 0..1: how gold the crown burns (0 = a dark indigo crown, .55 = the opening, 1 = full bloom) · o.front false = skip the rim
//   leaves (for flights through the crown) · o.lantern(n) → lantern options for lantern n (12 … 1) on the low limb, or null = hidden
export const TREE = { x: 1500, y: 935, core: [1470, 250], crown: { x: 1470, y: 235, rx: 600, ry: 330 }, du: { x: 1250, y: 905, h: 118 } };
const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]; };
// limbs: [p0, c1, c2, p1, w0, w1] — grown once (seeded): a flared trunk, five curved main limbs that fork twice; the leaf masses sit on the tips
const LIMBS = [], TIPS = [];
(() => {
  const r = prng(2830);
  LIMBS.push([[1500, 960], [1504, 820], [1488, 700], [1492, 590], 240, 124]);                                           // trunk
  LIMBS.push([[1440, 935], [1380, 944], [1320, 950], [1250, 958], 70, 6], [[1566, 930], [1640, 940], [1710, 948], [1780, 958], 76, 6], [[1470, 945], [1440, 950], [1410, 956], [1370, 960], 44, 4]);   // roots
  const grow = (x, y, ang, len, w, depth) => {
    const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len, px = -Math.sin(ang), py = Math.cos(ang), bend = len * (r() - .5) * .34;
    LIMBS.push([[x, y], [x + Math.cos(ang) * len * .35 + px * bend, y + Math.sin(ang) * len * .35 + py * bend], [x + Math.cos(ang) * len * .72 + px * bend * .5, y + Math.sin(ang) * len * .72 + py * bend * .5], [ex, ey], w, w * .6]);
    if (depth <= 0) { TIPS.push([ex, ey, w]); return; }
    const k = depth === 2 ? 2 : 2 + (r() < .4 ? 1 : 0);
    for (let i = 0; i < k; i++) { const da = (i - (k - 1) / 2) * (.62 + r() * .2) + (r() - .5) * .15; grow(ex, ey, ang + da, len * (.6 + r() * .14), w * .6, depth - 1); }
    TIPS.push([ex, ey, w * 1.4]);
  };
  for (const [x, y, ang, len, w] of [[1474, 650, -2.42, 400, 98], [1482, 600, -2.0, 390, 86], [1494, 586, -1.6, 330, 80], [1504, 600, -1.18, 390, 86], [1514, 648, -.72, 420, 96]]) grow(x, y, ang, len, w, 2);
})();
// the lantern limb: low, long, reaching left from the trunk (No. 1 near the trunk … No. 12 at the tip)
export const LOWLIMB = [[1452, 668], [1180, 650], [760, 612], [372, 552]];
const LOW_W = [62, 13];
// lantern n hangs at s along the low limb; string length seeded
export function treeLantern(n) {
  const s = .12 + (n - 1) / 11 * .82, p = bez(...LOWLIMB, s), r = prng(n * 17 + 3); r();
  return { x: p[0], y: p[1] + LOW_W[0] * (1 - s) * .32 + 2, len: 34 + r() * 46, s: 46 };
}
const TREE_PATHS = (() => {
  // NOTE: napi-rs Path2D.addPath joins sub-paths (its first moveTo becomes a lineTo), so every limb is written into ONE path directly
  const limb = (p0, c1, c2, p1, w0, w1, path = new Path2D()) => {
    const n = 26, L = [], R = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n, p = bez(p0, c1, c2, p1, u), q = bez(p0, c1, c2, p1, Math.min(1, u + .01)), r0 = bez(p0, c1, c2, p1, Math.max(0, u - .01));
      const dx = q[0] - r0[0], dy = q[1] - r0[1], l = Math.hypot(dx, dy) || 1, w = lerp(w0, w1, Math.pow(u, .8)) / 2;
      L.push([p[0] - dy / l * w, p[1] + dx / l * w]); R.push([p[0] + dy / l * w, p[1] - dx / l * w]);
    }
    L.forEach((v, i) => (i ? path.lineTo(v[0], v[1]) : path.moveTo(v[0], v[1]))); R.reverse().forEach((v) => path.lineTo(v[0], v[1])); path.closePath();
    return path;   // no round end cap: a cap circle winds against the polygon and punches a hole (nonzero); the tips sit inside the leaves
  };
  const limbs = new Path2D(); for (const l of LIMBS) limb(...l, limbs);
  const low = limb(...LOWLIMB, ...LOW_W); limb(LOWLIMB[3], [350, 540], [328, 528], [300, 512], 13, 4, low);
  // leaf masses: a back mass on every tip (big, overlapping into a canopy with gaps where the inner light shows), a front mass on the
  // outer tips (smaller, pushed outward and down: they overlap the limb ends so the limbs disappear into the leaves)
  const r = prng(2811), C = TREE.crown, clusters = [];
  const blob = (x, y, R) => { let p = new Path2D(); p.arc(x, y, R, 0, TAU); const k = 6 + Math.floor(r() * 4); for (let i = 0; i < k; i++) { const a = r() * TAU, d = R * (.5 + r() * .4), q = new Path2D(); q.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * .75, R * (.38 + r() * .3), 0, TAU); p = p.op(q, PathOp.Union); } return p; };
  for (const [x, y, w] of TIPS) { if (w > 60) continue; clusters.push({ x: x + (r() - .5) * 30, y: y - 10 - r() * 30, R: 92 + r() * 58, layer: 0, path: null }); }
  for (const [x, y, w] of TIPS) { if (w > 40) continue; const dx = x - C.x, dy = y - C.y, d = Math.hypot(dx, dy) || 1; if (d < C.rx * .55) continue; clusters.push({ x: x + dx / d * 40, y: y + 24 + dy / d * 20, R: 58 + r() * 40, layer: 1, path: null }); }
  // hanging lobes along the lower rim of the crown (left and right of the trunk): lit from above-inside, they hide where limbs leave the leaves
  for (let i = 0; i < 14; i++) { const a = Math.PI * (.08 + .84 * i / 13), x = C.x + Math.cos(a) * C.rx * .95, y = C.y + 40 + Math.sin(a) * C.ry * 1.0; if (Math.abs(x - 1490) < 170) continue; clusters.push({ x, y, R: 70 + r() * 45, layer: 1, path: null }); }
  for (const c of clusters) c.path = blob(c.x, c.y, c.R);
  // the inner canopy: one big soft mass behind the limbs that carries the gold light (the limbs read dark against it)
  let canopy = new Path2D(); { const r2 = prng(2840); for (let i = 0; i < 22; i++) { const a = r2() * TAU, d = Math.sqrt(r2()) * .78, q = new Path2D();
    q.arc(C.x + Math.cos(a) * C.rx * d, C.y + 30 + Math.sin(a) * C.ry * d * .9, 150 + r2() * 110, 0, TAU); canopy = canopy.op(q, PathOp.Union); } }
  return { limbs, low, clusters, canopy };
})();
export function tree(ctx, t, o = {}) {
  const g = clamp(o.glow ?? .55), [lx, ly] = TREE.core, C = TREE.crown, br = 1 + .015 * Math.sin(t * .8);
  // 1 · the light inside the crown
  halo(ctx, lx, ly, 980 * br, .5 * g, P.halo1, P.core1);
  halo(ctx, lx, ly + 40, 520 * br, .55 * g, P.halo0, P.core0);
  // 2 · back clusters: near the core they burn gold, outward they cool to indigo
  const sway = (c) => [2.2 * Math.sin(t * .55 + c.x * .01), 1.5 * Math.sin(t * .47 + c.y * .013)];
  const fillCluster = (c, warmK) => {
    // lit from INSIDE the crown: the side facing the core burns gold, the outer side falls off to indigo through grain
    const dx = c.x - lx, dy = c.y - ly, d = Math.hypot(dx, dy) || 1, nd = clamp(d / (C.rx * 1.05)), ux = dx / d, uy = dy / d;
    const heat = clamp(g * warmK * 1.7 * Math.pow(1 - nd, .55));
    const near = mixHex(mixHex(INK.leaf, P.shade0, .5), mixHex(P.halo0, P.core1, .35 * (1 - nd)), heat);
    const mid = mixHex(INK.leaf, mixHex(P.shade0, P.halo1, .3), .55 * heat);
    const far = mixHex(P.night1, INK.leaf, .45);
    const [sx, sy] = sway(c);
    ctx.save(); ctx.translate(sx, sy);
    ctx.fillStyle = lin(ctx, c.x - ux * c.R * 1.25, c.y - uy * c.R * 1.25, c.x + ux * c.R * 1.1, c.y + uy * c.R * 1.1, [[0, near], [.5, mid], [1, far]]);
    ctx.fill(c.path); ctx.restore();
  };
  // inner canopy: gold at the core, amber, then the leaf indigo at its rim
  const gk = clamp(g * 1.6);
  ctx.fillStyle = rad(ctx, lx, ly + 60, C.rx * 1.05, [[0, mixHex(INK.leaf, P.core1, gk)], [.25, mixHex(INK.leaf, P.halo0, gk)], [.55, mixHex(INK.leaf, mixHex(P.halo1, P.shade0, .5), .9 * gk)], [.85, mixHex(INK.leaf, P.shade0, .45 * gk)], [1, mixHex(P.night1, INK.leaf, .6)]]);
  ctx.fill(TREE_PATHS.canopy);
  for (const c of TREE_PATHS.clusters) if (c.layer === 0) fillCluster(c, 1);
  // the light shining through the crown (additive, over the back leaves): the hero light of the film
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  halo(ctx, lx, ly + 30, 560 * br, .55 * g, P.halo0, P.core1);
  halo(ctx, lx, ly + 20, 260 * br, .7 * g, P.halo0, P.core0);
  ctx.restore();
  // 3 · limbs and trunk (silhouettes, lit from the crown above), the lantern limb, the lanterns
  ctx.fillStyle = lin(ctx, 0, 0, 0, TREE.y, [[0, mixHex(INK.near, P.shade0, .45 * g)], [.45, mixHex(INK.near, P.shade0, .18 * g)], [1, P.night0]]);
  ctx.fill(TREE_PATHS.limbs);
  ctx.fillStyle = lin(ctx, 300, 0, 1460, 0, [[0, INK.near], [1, mixHex(INK.near, P.shade0, .12 * g)]]); ctx.fill(TREE_PATHS.low);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 1380, 0, 1620, 0, [[0, rgba(P.halo1, 0)], [.5, rgba(P.halo1, .08 * g)], [1, rgba(P.halo1, 0)]]); ctx.fill(TREE_PATHS.limbs); ctx.restore();
  if (o.lantern) for (let n = 12; n >= 1; n--) { const lo = o.lantern(n); if (!lo) continue; const L = treeLantern(n); lantern(ctx, t, L.x, L.y, lo.s ?? L.s, { len: L.len, seed: n, ...lo }); }
  // 4 · rim leaves in front
  if (o.front !== false) for (const c of TREE_PATHS.clusters) if (c.layer === 1) fillCluster(c, .8);
  if (g > 0) E.dust(ctx, 2812, 320, lx, ly + 30, C.rx * .55, C.ry * .55, t, .5 * g, P.core1);
}

// ======================================================================================================================== LANTERNS
// a hanging lantern: (x, y) = where its string hangs, s = glass height. A lit lantern is a WINDOW: o.inside(ctx, 1000, h) draws a
// vignette in a local space 1000 units wide (clipped to the glass). o { lit 0..1 (warm glass), len (string), swing (rad), seed, a,
//   glass 0..1 (how much of the window shows the inside instead of plain light; default 1 when inside is given), num (a small number
//   on the glass), numA 0..1 (its alpha), cap: false } → { x, y, w, h } the glass rect in the caller's space
export function lantern(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= .5) return null;
  const len = o.len ?? s * .8, sw = (o.swing ?? 0) + .018 * Math.sin(t * .7 + (o.seed ?? 0) * 1.3), lit = clamp(o.lit ?? 0);
  const w = s * .66, gy = len + s * .2;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(sw);
  if (lit > 0) { halo(ctx, 0, gy + s / 2, s * (2.6 + .25 * Math.sin(t * 1.3 + (o.seed ?? 0))), .5 * lit, P.halo0, P.core1); halo(ctx, 0, gy + s / 2, s * 1.1, .55 * lit, P.halo0, P.core0); }
  ctx.strokeStyle = rgba(INK.rim, .7); ctx.lineWidth = Math.max(.6, s * .025); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, len); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, len + s * .02, s * .05, 0, TAU); ctx.stroke();
  // cap
  const cap = new Path2D(); cap.moveTo(-w * .62, gy); cap.lineTo(w * .62, gy); cap.lineTo(w * .3, gy - s * .2); cap.lineTo(-w * .3, gy - s * .2); cap.closePath();
  ctx.fillStyle = mixHex(INK.near, P.shade0, .35 * lit); ctx.fill(cap);
  // glass
  const gx0 = -w / 2, gy0 = gy, gh = s;
  ctx.save(); ctx.beginPath(); ctx.roundRect(gx0, gy0, w, gh, s * .07); ctx.clip();
  const lk = Math.sqrt(lit);
  ctx.fillStyle = lin(ctx, 0, gy0, 0, gy0 + gh, [[0, mixHex(mixHex(P.night1, P.ind1, .5), P.core1, lk)], [.6, mixHex(P.ind0, P.halo0, lk)], [1, mixHex(P.night0, P.shade0, lk)]]);
  ctx.fillRect(gx0, gy0, w, gh);
  if (o.inside) { const k = w / 1000, gl = clamp(o.glass ?? 1); if (gl > 0) { ctx.save(); ctx.globalAlpha *= gl; ctx.translate(gx0, gy0); ctx.scale(k, k); o.inside(ctx, 1000, gh / k); ctx.restore(); } }
  ctx.fillStyle = rgba(P.cream, .08 + .06 * (1 - lit)); ctx.beginPath(); ctx.moveTo(gx0 + w * .12, gy0); ctx.lineTo(gx0 + w * .3, gy0); ctx.lineTo(gx0 + w * .1, gy0 + gh); ctx.lineTo(gx0 - w * .08, gy0 + gh); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = mixHex(INK.near, P.shade0, .4 * lit); ctx.lineWidth = Math.max(.8, s * .05); ctx.beginPath(); ctx.roundRect(gx0, gy0, w, gh, s * .07); ctx.stroke();
  ctx.fillStyle = mixHex(INK.near, P.shade0, .35 * lit); ctx.beginPath(); ctx.roundRect(-w * .36, gy0 + gh - s * .01, w * .72, s * .09, s * .03); ctx.fill();
  if (o.num != null && (o.numA ?? 1) > 0) { ctx.save(); ctx.globalAlpha *= o.numA ?? 1; glowText(ctx, String(o.num), 0, gy0 + gh * .64, { size: s * .44, serif: true, align: 'center', glow: false, col: lit > .5 ? mixHex(P.shade0, P.night1, .4) : rgba(P.cream, .55 + .2 * a) }); ctx.restore(); }
  ctx.restore();
  // glass rect in the caller's space (ignores the tiny swing)
  return { x: x + gx0, y: y + gy0, w, h: gh, cx: x, cy: y + gy0 + gh / 2 };
}

// ======================================================================================================================== THE LAMP RAIL
// the countdown on screen: twelve mini lanterns on a wire, top left, No. 12 … No. 1 (the number on the glass). A lamp lights on its
// station's SOLUTION phrase (solve), never at the start. No. 8 lights only half. Under each lamp its tool object hangs from toolAt on.
export const LAMPS = [
  { n: 12, solve: 'In just ten days', tool: 'mic', toolAt: 'In just ten days' },
  { n: 11, solve: 'Not yours', tool: 'handset', toolAt: "One of Australia's big phone networks" },
  { n: 10, solve: 'Only the turbines in its path', tool: 'camera', toolAt: 'Only the turbines in its path' },
  { n: 9, solve: "The A.I. didn't need to be right", tool: 'photo', toolAt: "The A.I. didn't need to be right" },
  { n: 8, solve: 'Months after the alerts', tool: 'satellite', toolAt: "They're already up there", half: true, tag: 'BUILT TO WATCH FIELDS AND FORESTS' },
  { n: 7, solve: 'Then it speaks them', tool: 'tape', toolAt: 'Then it speaks them' },
  { n: 6, solve: 'The answer: about three in four', tool: 'radio', toolAt: 'Big ships are supposed', tag: "BUILT SO SHIPS DON'T COLLIDE" },
  { n: 5, solve: 'An A.I. learned to read', tool: 'gps', toolAt: 'The same signals your phone uses', tag: 'BUILT TO FIND YOUR WAY' },
  { n: 4, solve: 'This time, the warning gets an answer', tool: 'heat', toolAt: 'This time, the warning gets an answer' },
  { n: 3, solve: 'A lab asked an A.I.', tool: 'protein', toolAt: 'A lab asked an A.I.' },
  { n: 2, solve: 'After one short conversation', tool: 'chat', toolAt: 'Just an ordinary chatbot', tag: 'THE KIND THAT WRITES EMAILS' },
  { n: 1, solve: 'Except the news', tool: 'news', toolAt: 'A first clue', tag: 'WRITTEN FOR READERS' },
];
export const lamp = (n) => LAMPS.find((l) => l.n === n);
const tG = (T, p) => { try { return T.G(p); } catch { return 1e9; } };
// 0..1 how lit lamp n is at t (half lamps stop at .5) and 0..1 how far its tool object hangs
export const lampOn = (T, n, t) => { const L = lamp(n), ta = tG(T, L.solve); return smooth(span(t, ta + .1, ta + 1.0)) * (L.half ? .5 : 1); };
export const toolOn = (T, n, t) => { const L = lamp(n), ta = tG(T, L.toolAt); return span(t, ta + .2, ta + 1.2); };
export const RAIL = { x: 92, y: 40, gap: 37, s: 27, len: 12 };
export const railPos = (n) => [RAIL.x + (12 - n) * RAIL.gap, RAIL.y, RAIL.s];
// o { a, from(n) → [x, y, s, len] screen position of lantern n while it morphs in (m 0..1; lamps stagger 12 → 1), m, mOf(n) → 0..1 per-lamp
//   morph instead (a lamp with mOf ≤ 0 is not drawn), skip(n) → true to leave lamp n out, tools (default true), lit(n) override }
export function lampRail(ctx, t, T, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const m = o.m ?? 1, tools = o.tools ?? true;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (m > .5) { const wa = a * span(m, .5, 1); ctx.strokeStyle = rgba(INK.rim, .45 * wa); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(RAIL.x - 24, RAIL.y + 2); ctx.quadraticCurveTo(RAIL.x + 5.5 * RAIL.gap, RAIL.y + 9, RAIL.x + 11 * RAIL.gap + 24, RAIL.y + 2); ctx.stroke(); }
  for (const L of LAMPS) {
    if (o.skip && o.skip(L.n)) continue;
    const mN = o.mOf ? o.mOf(L.n) : m; if (mN <= 0 && o.mOf) continue;
    const [rx, ry, rs] = railPos(L.n), f = o.from ? o.from(L.n) : null, mm = o.mOf ? sineIO(clamp(mN)) : sineIO(clamp(m * 1.25 - (12 - L.n) * .025));
    const x = f ? lerp(f[0], rx, mm) : rx, y = f ? lerp(f[1], ry, mm) : ry, s = f ? lerp(f[2], rs, mm) : rs;
    const lit = o.lit ? o.lit(L.n) : lampOn(T, L.n, t), ta = tG(T, L.solve), pulse = bump(t, ta + .1, 1.4);
    lantern(ctx, t, x, y, s * (1 + .12 * pulse), { len: lerp(f ? f[3] ?? RAIL.len : RAIL.len, RAIL.len, mm), lit, seed: L.n, num: L.n, a, swing: .05 * pulse });
    if (tools) { const u = toolOn(T, L.n, t); if (u > 0) { const q = s / rs, ty = y + lerp(f ? f[3] ?? RAIL.len : RAIL.len, RAIL.len, mm) + s * 1.2, k = expoOut(u);   // the tool rides under its lamp (also while it morphs in)
      ctx.strokeStyle = rgba(INK.rim, .5 * a * k); ctx.lineWidth = Math.max(1, q); ctx.beginPath(); ctx.moveTo(x, ty); ctx.lineTo(x, ty + 10 * k * q); ctx.stroke();
      tool(ctx, L.tool, x, ty + (10 * k + 11) * q, 22 * k * q, { a: a * k, lit: lit > .4 ? .6 : 0 }); } }
  }
  ctx.restore();
}

// ======================================================================================================================== TOOL OBJECTS
// what each station's A.I. rode on: the gallery of the ending. Glyphs in a unit box (−.5 … .5), drawn like engraved light.
export const TOOLS = ['mic', 'handset', 'camera', 'photo', 'satellite', 'tape', 'radio', 'gps', 'heat', 'protein', 'chat', 'news', 'email', 'ad', 'laptop'];
const TP = new Map();
export function toolPath(name) {
  if (TP.has(name)) return TP.get(name);
  const SW = .075, U = (a, b) => a.op(b, PathOp.Union);
  let out = new Path2D();
  const st = (p, w = SW) => { out = U(out, p.stroke({ width: w, cap: 1, join: 1 })); };
  const fill = (p) => { out = U(out, p); };
  const L = (pts, w) => { const p = new Path2D(); pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y))); st(p, w); };
  const R = (x, y, w, h, r = .04, sw) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); st(p, sw); };
  const C = (x, y, r, sw) => { const p = new Path2D(); p.arc(x, y, r, 0, TAU); st(p, sw); };
  const D = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, TAU); fill(p); };
  const A = (x, y, r, a0, a1, sw) => { const p = new Path2D(); p.arc(x, y, r, a0, a1); st(p, sw); };
  switch (name) {
    case 'mic': R(-.13, -.44, .26, .5, .13); A(0, -.06, .25, .15, Math.PI - .15); L([[0, .2], [0, .36]]); L([[-.16, .38], [.16, .38]]); break;
    case 'handset': { const p = new Path2D(); p.moveTo(-.36, .1); p.quadraticCurveTo(0, -.46, .36, .1); st(p, .13); const e1 = new Path2D(); e1.ellipse(-.34, .16, .14, .09, -.9, 0, TAU); fill(e1); const e2 = new Path2D(); e2.ellipse(.34, .16, .14, .09, .9, 0, TAU); fill(e2); break; }
    case 'camera': R(-.3, -.3, .6, .34, .08); C(0, -.13, .1, .06); L([[0, .04], [0, .44]], .07); L([[-.18, .44], [.18, .44]]); L([[-.2, .22], [.2, .22]], .05); break;
    case 'photo': R(-.42, -.36, .84, .72, .04); L([[-.3, .12], [-.2, -.04], [-.1, .1], [0, -.12], [.1, .08], [.22, -.06], [.3, .14]], .05); L([[-.34, .26], [.34, .26]], .04); break;
    case 'satellite': R(-.1, -.14, .2, .28, .03); R(-.48, -.09, .3, .18, .02, .055); R(.18, -.09, .3, .18, .02, .055); L([[-.33, -.09], [-.33, .09]], .04); L([[.33, -.09], [.33, .09]], .04); A(0, .3, .14, Math.PI * 1.1, Math.PI * 1.9, .06); L([[0, .14], [0, .2]], .05); break;
    case 'tape': R(-.44, -.28, .88, .56, .06); C(-.18, -.06, .1, .06); C(.18, -.06, .1, .06); R(-.24, .1, .48, .1, .02, .05); break;
    case 'radio': L([[0, .3], [0, -.26]], .07); L([[-.16, -.12], [.16, -.12]], .05); A(0, -.3, .14, -2.5, -.64, .05); A(0, -.3, .26, -2.5, -.64, .05); { const p = new Path2D(); p.moveTo(-.4, .28); p.lineTo(.4, .28); p.lineTo(.28, .44); p.lineTo(-.28, .44); p.closePath(); fill(p); } break;
    case 'gps': { const p = new Path2D(); p.moveTo(0, -.4); p.lineTo(.3, .34); p.lineTo(0, .18); p.lineTo(-.3, .34); p.closePath(); fill(p); C(0, 0, .48, .04); break; }
    case 'heat': { const p = new Path2D(); p.moveTo(-.46, 0); p.quadraticCurveTo(0, -.42, .46, 0); p.quadraticCurveTo(0, .42, -.46, 0); p.closePath(); st(p, .065); D(0, 0, .15); C(0, 0, .25, .04); break; }
    case 'protein': { const p = new Path2D(); const q = E.catmull([[-.42, .2], [-.28, -.24], [-.1, .14], [.06, -.3], [.2, .1], [.34, -.18], [.42, .26]], 8); q.forEach((v, i) => (i ? p.lineTo(v[0], v[1]) : p.moveTo(v[0], v[1]))); st(p, .1); D(-.42, .2, .06); D(.42, .26, .06); break; }
    case 'chat': R(-.42, -.34, .84, .52, .14); L([[-.18, .18], [-.26, .38], [.02, .18]]); D(-.18, -.08, .05); D(0, -.08, .05); D(.18, -.08, .05); break;
    case 'news': R(-.4, -.36, .8, .72, .03); L([[-.28, -.2], [.28, -.2]], .1); for (const y of [-.04, .08, .2]) { L([[-.28, y], [-.04, y]], .04); L([[.04, y], [.28, y]], .04); } break;
    case 'email': R(-.44, -.3, .88, .6); L([[-.44, -.28], [0, .06], [.44, -.28]]); break;
    case 'ad': R(-.42, -.34, .84, .68, .05); L([[-.28, -.16], [.1, -.16]], .08); D(.24, .14, .1); L([[-.28, .06], [0, .06]], .05); break;
    case 'laptop': R(-.36, -.34, .72, .48, .04); L([[-.46, .24], [.46, .24], [.4, .14], [-.4, .14], [-.46, .24]], .05); break;
    default: C(0, 0, .3);
  }
  TP.set(name, out); return out;
}
// draw a tool object centred at (x, y), size s. o { a, lit 0..1 (0 = cream engraving, 1 = warm light), col 'cool'|'warm'|'cream', glow }
export function tool(ctx, name, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 1) return;
  const lit = clamp(o.lit ?? 0), col = o.col === 'cool' ? COOL.body : o.col === 'warm' ? P.halo0 : mixHex(P.cream, mixHex(P.halo0, P.coat, .5), lit);
  if ((o.glow ?? 1) > 0) halo(ctx, x, y, s * (.9 + .5 * lit), (.1 + .3 * lit) * a * (o.glow ?? 1), lit > .5 ? P.halo0 : P.blue0, lit > .5 ? P.core1 : COOL.body);
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.translate(x, y); ctx.scale(s, s); ctx.fill(toolPath(name), 'evenodd'); ctx.restore();   // no addPath (napi joins sub-paths)
}
// a small paper tag on a string (the gallery's "built for …"): (x, y) = where the string hangs; u grows it (it swings in)
export function tag(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const size = o.size ?? 17, tw = measure(text, size, false, 600) + size * text.length * .1, w = tw + size * 1.6, h = size * 1.9, len = o.len ?? 22;
  const sw = (o.swing ?? 0) + (1 - expoOut(u)) * .5 + .02 * Math.sin(t * 1.1 + x * .01);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.globalAlpha *= rise(u);
  ctx.strokeStyle = rgba(P.halo2, .7); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, len); ctx.stroke();
  const y0 = len, p = new Path2D(); p.moveTo(-w / 2 + h * .35, y0); p.lineTo(w / 2, y0); p.lineTo(w / 2, y0 + h); p.lineTo(-w / 2 + h * .35, y0 + h); p.lineTo(-w / 2, y0 + h / 2); p.closePath();
  ctx.save();
  ctx.fillStyle = o.col === 'cool' ? mixHex(COOL.body, P.night1, .2) : mixHex(P.halo2, P.core1, .3); ctx.fill(p);
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(-w / 2 + h * .42, y0 + h / 2, size * .14, 0, TAU); ctx.fill();
  glowText(ctx, text, -w / 2 + h * .7, y0 + h * .66, { size, weight: 600, spacing: .1, col: P.night1, glow: false });
  ctx.restore(); ctx.restore();
}

// ======================================================================================================================== SMALL THINGS
// a laptop seen from the front-side: (x, y) = front edge centre, s = width. o { open 0..1, screen(ctx, w, h) (local px), glow 0..1 }
export function laptop(ctx, t, x, y, s, o = {}) {
  const op = clamp(o.open ?? 1), sh = s * .62 * op, sw = s * .82, g = o.glow ?? 1;
  ctx.save(); ctx.translate(x, y);
  if (g > 0) halo(ctx, 0, -sh * .5 - s * .05, s * 1.1, .35 * g * op, COOL.halo, COOL.body);
  ctx.fillStyle = mixHex(INK.near, P.blue1, .35); ctx.beginPath(); ctx.moveTo(-s / 2, 0); ctx.lineTo(s / 2, 0); ctx.lineTo(s * .44, -s * .07); ctx.lineTo(-s * .44, -s * .07); ctx.closePath(); ctx.fill();
  ctx.fillStyle = INK.near; ctx.beginPath(); ctx.roundRect(-sw / 2, -s * .07 - sh, sw, sh, s * .02); ctx.fill();
  const ix = -sw / 2 + s * .03, iy = -s * .07 - sh + s * .03, iw = sw - s * .06, ih = sh - s * .05;
  if (ih > 2) { ctx.save(); ctx.beginPath(); ctx.rect(ix, iy, iw, ih); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, iy, 0, iy + ih, [[0, mixHex(COOL.deep, COOL.body, .35 * g)], [1, mixHex(P.night1, COOL.deep, .8)]]); ctx.fillRect(ix, iy, iw, ih);
    if (o.screen) { ctx.translate(ix, iy); o.screen(ctx, iw, ih); } ctx.restore(); }
  ctx.restore();
  return { x: x - sw / 2 + s * .03, y: y - s * .07 - sh + s * .03, w: sw - s * .06, h: sh - s * .05 };
}
// a voice as a small warm squiggle (a firefly of sound): centre (x, y), width s. o { a, col, ph, amp }
export function voiceWave(ctx, t, x, y, s, o = {}) {
  // one voice: a warm firefly (glowing core) carrying a tiny wave. Small sizes read as a light, large ones show the wave.
  const a = o.a ?? 1; if (a <= 0 || s < .5) return;
  const col = o.col ?? P.halo0, ph = o.ph ?? 0, amp = (o.amp ?? .16) * s, fl = .85 + .15 * Math.sin(t * 5.3 + ph * 3);
  halo(ctx, x, y, s * 1.9, .45 * a * fl, col, P.core1);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, y, Math.max(1.2, s * .11), 0, TAU); ctx.fill();
  ctx.globalAlpha *= .75; ctx.strokeStyle = mixHex(col, P.core0, .4); ctx.lineWidth = Math.max(.8, s * .07); ctx.lineCap = 'round'; ctx.beginPath();
  for (let i = 0; i <= 18; i++) { const u = i / 18, env = Math.sin(Math.PI * u); const yy = y + Math.sin(u * TAU * 1.5 + t * 7 + ph) * amp * env; i ? ctx.lineTo(x - s / 2 + u * s, yy) : ctx.moveTo(x - s / 2, yy); }
  ctx.stroke(); ctx.restore();
}
// radio rings going out from (x, y) (an antenna, a mast): n rings, radius r, o { a, col, speed, arc: [a0, a1] (default the upper half) }
export function radioRings(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1, n = o.n ?? 3; if (a <= 0) return;
  const [a0, a1] = o.arc ?? [-Math.PI * .92, -Math.PI * .08];
  ctx.save(); ctx.lineCap = 'round';
  for (let k = 0; k < n; k++) { const u = ((t * (o.speed ?? .45) + k / n) % 1); ctx.strokeStyle = rgba(o.col ?? WARM.line, a * (1 - u) * .85); ctx.lineWidth = Math.max(1, r * .03); ctx.beginPath(); ctx.arc(x, y, r * (.15 + .85 * u), a0, a1); ctx.stroke(); }
  ctx.restore();
}
// a big serif question mark that rises (the open question of the film)
export function questionMark(ctx, t, x, y, s, u, o = {}) {
  if (u <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  maskLine(ctx, [['?', o.warm ?? 1]], x, y, s, rise(u), { align: 'center' }); ctx.restore();
}

// ======================================================================================================================== REAL STAMPS
// Jakob 10.11.: show unmistakably that every system is real. One gold stamp per station: REAL · STATUS, and the place / source line
// under it. Screen space, bottom left above the subtitles (o.x, o.y = the stamp's left edge and centre line), 3 s by default.
// Wording from text-v2.md; the fact check (faktencheck.md) overrides.
export const STAMPS = {
  elephants: { status: 'LIVE', place: 'MADUKKARAI, TAMIL NADU, INDIA' },
  casey: { status: 'IN DAILY USE', place: 'CASEY HARRELL · BRAINGATE2 · UC DAVIS HEALTH' },
  nazca: { status: 'PEER-REVIEWED', place: 'NAZCA, PERU · SAKAI ET AL., PNAS 2024' },
  tehiku: { status: null, place: 'TE HIKU MEDIA · KAITĀIA, NEW ZEALAND' },
  apate: { status: 'LIVE', place: 'APATE.AI · AUSTRALIA · ALL FIGURES: THE COMPANY' },
  identiflight: { status: 'LIVE', place: 'IDENTIFLIGHT · TOP OF THE WORLD WIND FARM, WYOMING' },
  mars: { status: 'IN DAILY USE', place: 'UNEP METHANE ALERT AND RESPONSE SYSTEM (MARS)' },
  gfw: { status: 'PEER-REVIEWED', place: 'GLOBAL FISHING WATCH · PAOLO ET AL., NATURE 2024' },
  guardian: { status: 'LIVE RESEARCH SYSTEM', place: 'NASA JPL GUARDIAN' },
  baker: { status: 'PEER-REVIEWED', place: 'BAKER LAB & PARTNERS · NATURE 2025' },
  debunk: { status: 'PEER-REVIEWED', place: 'COSTELLO, PENNYCOOK & RAND · SCIENCE 2024' },
  groundsource: { status: null, place: 'GOOGLE RESEARCH · GROUNDSOURCE' },
  floodhub: { status: 'LIVE', place: 'GOOGLE FLOOD HUB' },
};
export function realStamp(ctx, t, t0, t1, key, o = {}) {
  const st = typeof key === 'string' ? STAMPS[key] : key; if (!st || t < t0 - .25 || (t1 != null && t > t1 + .45)) return;
  const size = o.size ?? 30, text = st.status ? `REAL · ${st.status}` : 'REAL';
  const tw = measure(text, size, false, 600) + size * text.length * .12, bw = tw + size * 1.2;
  const x = (o.x ?? 110) + bw / 2, y = o.y ?? 806;
  ctx.save(); if (o.screen !== false) ctx.setTransform(1, 0, 0, 1, 0, 0);
  stamp(ctx, t, text, x, y, { t0, size, rot: o.rot ?? -.035, ink: P.halo0, out: t1 });
  const u = rise(span(t, t0 + .25, t0 + .9)) * (t1 != null ? 1 - expoIn(span(t, t1, t1 + .4)) : 1);
  if (u > 0 && st.place) maskLine(ctx, [[st.place, 0]], x - bw / 2 + 4, y + size * 1.55, size * .6, u, { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
}

// ======================================================================================================================== EXPLAINER EXTRAS
// a field of dots (leads, calls, boats, reports): o { x, y, w, h, n, layout 'grid'|'scatter', cols, r, seed, u (grow, staggered),
//   on(k) → 0..1 (lit), col(k) → 'warm'|'cool'|'dim', a }
const FIELD = new Map();
export function dotField(ctx, t, o) {
  const n = o.n, key = `${o.seed ?? 1}:${n}:${o.layout}`, a = o.a ?? 1; if (a <= 0) return;
  if (!FIELD.has(key)) { const r = prng(o.seed ?? 1), pts = []; for (let k = 0; k < n; k++) pts.push([r(), r(), r()]); FIELD.set(key, pts); }
  const pts = FIELD.get(key), cols = o.cols ?? Math.ceil(Math.sqrt(n * o.w / o.h)), rows = Math.ceil(n / cols), rr = o.r ?? 3;
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < n; k++) {
    const p = pts[k], e = rise(span(o.u ?? 1, p[2] * .7, p[2] * .7 + .3)); if (e <= 0) continue;
    const x = o.layout === 'grid' ? o.x + (k % cols + .5) * o.w / cols : o.x + p[0] * o.w, y = o.layout === 'grid' ? o.y + (Math.floor(k / cols) + .5) * o.h / rows : o.y + p[1] * o.h;
    const on = o.on ? clamp(o.on(k)) : 1, c = o.col ? o.col(k) : 'cool';
    const col = c === 'warm' ? P.halo0 : c === 'dim' ? P.blue1 : COOL.body;
    ctx.fillStyle = rgba(mixHex(P.blue1, col, on), (.35 + .65 * on) * e); ctx.beginPath(); ctx.arc(x, y, rr * (.6 + .4 * e) * (.8 + .2 * on), 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// a ruler of light: a long line with ticks that fills warm (hours of speech, years, km). o { x, y, w, u (the line grows), fill 0..1,
//   ticks: [[v 0..1, label]], minor (count), label (left, above), col 'warm'|'cool', a }
export function ruler(ctx, t, o) {
  const u = expoOut(clamp(o.u ?? 1)), a = o.a ?? 1; if (u <= 0 || a <= 0) return;
  const { x, y, w } = o, f = Math.min(clamp(o.fill ?? 0), u);   // the fill never runs ahead of the line (it draws back with it)
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * u, y); ctx.stroke();
  const mn = o.minor ?? 30; for (let k = 0; k <= mn; k++) { const v = k / mn; if (v > u) break; ctx.strokeStyle = rgba(P.blue1, .7); ctx.beginPath(); ctx.moveTo(x + w * v, y - 6); ctx.lineTo(x + w * v, y + 6); ctx.stroke(); }
  for (const [v, s] of o.ticks || []) { if (v > u + 1e-6) continue; ctx.strokeStyle = rgba(P.cream, .6); ctx.beginPath(); ctx.moveTo(x + w * v, y - 12); ctx.lineTo(x + w * v, y + 12); ctx.stroke(); glowText(ctx, s, x + w * v, y + 44, { size: 24, align: 'center', glow: false, col: WARM.text, spacing: .1 }); }
  if (f > 0) E.trail(ctx, [[x, y, 6], [x + w * f, y, 6]], 1, { w: 6, spark: f < 1 });
  if (o.label) glowText(ctx, o.label, x, y - 30, { size: 24, glow: false, spacing: .12, col: o.col === 'cool' ? COOL.text : WARM.text, a: rise(span(u, .3, 1)) });
  ctx.restore();
}
// the thumbnail line: Inter 600 caps, cream with a warm glow, slightly condensed. u rises, o.out sinks (0..1).
export function thesis(ctx, t, x, y, u, o = {}) {
  if (u <= 0) return;
  const size = o.size ?? 120, lines = o.lines ?? ['THIS IS WHAT', 'A.I. SHOULD', 'BE USED FOR'];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(.9, 1.08);
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .14, .78 + i * .14)) * (o.out != null ? 1 - expoIn(clamp(o.out * (1 + .12 * (lines.length - 1)) - i * .12)) : 1);
    if (ui > 0) maskLine(ctx, [[ln, 0]], 0, i * size * .98, size, ui, { serif: false, weight: 600, col: P.core0, glow: true });
  });
  ctx.restore();
}

// ======================================================================================================================== EXPLAINER BLOCKS
// light lines on a quiet axis. o { x, y, w, h, xr: [a, b], yr: [a, b], series: [{ data: [[x, y]…], col: 'warm'|'cool', u, w, label, labelU }],
//   base: y value of a dashed reference line, xTicks: [[v, text]], a }  → { map(x, y) → [px, py], heads: [[x, y]] }
export function chartLines(ctx, t, o) {
  const [x, y, w, h] = [o.x, o.y, o.w, o.h], [xa, xb] = o.xr, [ya, yb] = o.yr, a = o.a ?? 1;
  const map = (px, py) => [x + (px - xa) / (xb - xa) * w, y + h - (py - ya) / (yb - ya) * h];
  ctx.save(); ctx.globalAlpha *= a;
  const au = expoOut(clamp(o.axisU ?? 1));
  ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w * au, y + h); ctx.stroke();
  if (o.base != null) { const [, by] = map(xa, o.base); ctx.setLineDash([3, 10]); ctx.strokeStyle = rgba(P.cream, .3); ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x + w * au, by); ctx.stroke(); ctx.setLineDash([]); }
  for (const [v, s] of o.xTicks || []) glowText(ctx, s, map(v, ya)[0], y + h + 40, { size: 24, align: 'center', glow: false, col: WARM.text, spacing: .1, a: au });
  const heads = [];
  for (const S of o.series) {
    const pts = E.catmull(S.data.map((p) => [...map(p[0], p[1]), S.w ?? 5]), 10), u = clamp(S.u ?? 1);
    if (u <= 0) { heads.push(null); continue; }
    let head;
    if (S.col === 'cool') {
      const n = Math.max(2, Math.floor(pts.length * u)); ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = rgba(COOL.halo, .25); ctx.lineWidth = (S.w ?? 5) * 4; ctx.beginPath(); pts.slice(0, n).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      ctx.strokeStyle = COOL.body; ctx.lineWidth = S.w ?? 5; ctx.stroke(); ctx.restore(); head = pts[n - 1];
      if (u < 1) agent(ctx, t, head[0], head[1], 7, { ring: 0 });
    } else head = E.trail(ctx, pts, u, { w: S.w ?? 5, spark: u < 1 });
    heads.push(head);
    if (S.label && head) glowText(ctx, S.label, head[0] + 18, head[1] + 9 + (S.labelDy ?? 0), { size: 26, spacing: .1, col: S.col === 'cool' ? COOL.text : WARM.text, glow: false, a: rise(clamp(S.labelU ?? span(u, .85, 1))) });
  }
  ctx.restore();
  return { map, heads };
}
// a slab of light as a bar (length grows with u): (x, y) = left end, centre line y. o { col 'cool'|'warm'|'stone', u, a, label (left), value (right) }
export function slab(ctx, t, x, y, len, th, o = {}) {
  const u = expoOut(clamp(o.u ?? 1)), L = Math.max(2, len * u), a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const d = th * .5, top = new Path2D(); top.moveTo(x, y - th / 2); top.lineTo(x + L, y - th / 2); top.lineTo(x + L + d * .6, y - th / 2 - d * .5); top.lineTo(x + d * .6, y - th / 2 - d * .5); top.closePath();
  const end = new Path2D(); end.moveTo(x + L, y - th / 2); end.lineTo(x + L + d * .6, y - th / 2 - d * .5); end.lineTo(x + L + d * .6, y + th / 2 - d * .5); end.lineTo(x + L, y + th / 2); end.closePath();
  const col = o.col ?? 'stone';
  const face = col === 'cool' ? [mixHex(COOL.body, P.cream, .2), COOL.deep] : col === 'warm' ? [P.halo0, P.shade0] : [INK.leaf, P.night1];
  if (col === 'warm') halo(ctx, x + L * .5, y, Math.max(L * .6, th * 2), .18, P.halo1, P.halo0);
  if (col === 'cool') halo(ctx, x + L, y, th * 2.2, .2, COOL.halo, COOL.body);
  ctx.fillStyle = col === 'cool' ? mixHex(COOL.body, P.cream, .5) : col === 'warm' ? P.core1 : mixHex(P.blue1, P.blue0, .3); ctx.fill(top);
  ctx.fillStyle = col === 'cool' ? COOL.deep : col === 'warm' ? P.shade0 : P.night0; ctx.fill(end);
  ctx.fillStyle = lin(ctx, 0, y - th / 2, 0, y + th / 2, [[0, face[0]], [1, face[1]]]); ctx.fillRect(x, y - th / 2, L, th);
  ctx.restore();
  if (o.label) glowText(ctx, o.label, x - 22, y + 9, { size: o.size ?? 24, align: 'right', spacing: .08, glow: false, col: col === 'warm' ? WARM.text : col === 'cool' ? COOL.text : P.cream, a: a * rise(span(o.u ?? 1, 0, .4)) });
  if (o.value) glowText(ctx, o.value, x + L + d + 16, y + 10, { size: o.vsize ?? 28, serif: true, col: P.cream, a: a * rise(span(o.u ?? 1, .6, 1)) });
}
// rows of slabs. o { x, y, w (max length), pitch, th, rows: [{ label, v (0..1), col, value }], u, stagger }
export function slabBars(ctx, t, o) {
  o.rows.forEach((r, k) => slab(ctx, t, o.x, o.y + k * (o.pitch ?? 64), (o.w ?? 800) * r.v, o.th ?? 30, { col: r.col, label: r.label, value: r.value, u: span(o.u ?? 1, k * (o.stagger ?? .08), k * (o.stagger ?? .08) + .6), a: r.a ?? 1, size: o.size }));
}
// n tiles in a row (days): o { x, y, size, n, gap, u, col: 'warm'|'cool', label }
export function dayTiles(ctx, t, o) {
  const n = o.n, s = o.size ?? 48, g = o.gap ?? 10;
  for (let k = 0; k < n; k++) {
    const e = expoOut(span(o.u ?? 1, k / n * .7, k / n * .7 + .3)); if (e <= 0) continue;
    const x = o.x + k * (s + g), c = o.col === 'cool';
    ctx.save(); ctx.globalAlpha = e; ctx.translate(x + s / 2, o.y + s / 2); ctx.scale(e, e);
    ctx.fillStyle = lin(ctx, 0, -s / 2, 0, s / 2, c ? [[0, mixHex(COOL.body, P.cream, .3)], [1, COOL.deep]] : [[0, P.halo0], [1, P.shade0]]); ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, 6); ctx.fill();
    ctx.restore();
  }
  if (o.label) glowText(ctx, o.label, o.x, o.y + s + 44, { size: 26, spacing: .12, glow: false, col: o.col === 'cool' ? COOL.text : WARM.text, a: rise(span(o.u ?? 1, .5, 1)) });
}
// a thin light bracket over a span with a label: (x0 … x1) at y, opening downward; u grows it from the middle
export function bracket(ctx, x0, x1, y, u, text, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const m = (x0 + x1) / 2, hw = (x1 - x0) / 2 * expoOut(u), col = o.col === 'cool' ? COOL.line : WARM.line;
  ctx.save(); ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(m - hw, y + 16); ctx.lineTo(m - hw, y); ctx.lineTo(m + hw, y); ctx.lineTo(m + hw, y + 16); ctx.stroke(); ctx.restore();
  if (text) maskLine(ctx, [[text, o.warm ?? 0]], m, y - 18, o.size ?? 30, rise(span(u, .3, 1)), { serif: false, weight: 600, align: 'center', col: o.col === 'cool' ? COOL.text : P.cream, glow: false });
}
// a pinned label: a line from the anchor up-right, then TEXT / sub (wipe in from below). u 0..1
export function label(ctx, x, y, l1, l2, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const dx = o.dx ?? 50, dy = o.dy ?? -50, x1 = x + dx, y1 = y + dy, col = o.col === 'cool' ? COOL : WARM;
  rule(ctx, x, y, x1, y1, smooth(clamp(u * 1.6)), { w: 2 });
  maskLine(ctx, [[l1, o.warm ?? 0]], x1 + (dx < 0 ? -measure(l1, o.size ?? 26, false) - 6 : 6), y1 - 10, o.size ?? 26, u, { serif: false, weight: 600, col: o.col === 'cool' ? COOL.text : P.cream, glow: false });
  if (l2) maskLine(ctx, [[l2, 0]], x1 + (dx < 0 ? -measure(l2, (o.size ?? 26) * .72, false) - 6 : 6), y1 + 24, (o.size ?? 26) * .72, rise(span(u, .2, 1)), { serif: false, weight: 600, col: col.text, glow: false });
}
// a small source line (bottom left, above the subtitles), rises and sinks
export function source(ctx, t, t0, t1, s, o = {}) {
  const u = rise(span(t, t0, t0 + .7)) * (1 - expoIn(span(t, t1 - .5, t1))); if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [[s.toUpperCase(), 0]], o.x ?? 110, o.y ?? 880, 20, u, { serif: false, weight: 600, col: P.halo2, glow: false }); ctx.restore();
}

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The frame grows out of a thing in the scene (o.from = [cx, cy, r] circle, or { x, y, w, h } rectangle: a stone face, a monitor) and
// shrinks back after the clip. Footage: <F28CLIPS or the scratchpad f28/clips/ or ROOT/clips>/<id>/f00001.jpg… (30 fps); metadata (offset, fit, name, role, year)
// from audio/clips.json when the audio agent writes it. Until then a placeholder (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
// credit lines (text-v2.md [CLIP …] Bauchbinde, clips-f28.md 11.11.): name · role/source · year; len = the real cut. C4 is MUTE footage
// under the VO (NASA replay). C5b replaces C5 (coordinator 11.11.). Dates marked "ungeprüft" in clips.json stay off screen (year '').
const CLIPS0 = {
  C3a: { name: 'Casey Harrell', role: 'BrainGate2 participant · UC Davis Health', year: '2024', len: 3.9 },
  C1: { name: 'Peter-Lucas Jones', role: 'CEO, Te Hiku Media', year: '', len: 14.7 },
  C3: { name: 'Casey Harrell', role: 'BrainGate2 participant · UC Davis Health', year: '2024', len: 9.2 },
  C4: { name: 'NASA SVS', role: 'GUARDIAN replay · Hawaii', year: '', len: 6.0, mute: true },
  C5b: { name: 'David Rand', role: 'Co-author, DebunkBot study · Lawfare podcast', year: '', len: 9.8 },
};
// metadata written by the audio/clip agent: <ROOT>clips.json ({ clips: [{ id, offset?, fit? … }] }) or audio/clips.json (keyed by id).
// Only offset and fit are taken from it; the on-screen lines stay the checked ones above.
const CLIPS_JSON = [process.env.F28CLIPSJSON, ROOT + 'audio/clips.json'].find((f) => f && fs.existsSync(f));
const RAWMETA = CLIPS_JSON ? JSON.parse(fs.readFileSync(CLIPS_JSON, 'utf8')) : {};
export const CLIPMETA = Array.isArray(RAWMETA.clips) ? Object.fromEntries(RAWMETA.clips.map((c) => [c.id, c])) : RAWMETA;
export const CLIPS = Object.fromEntries(Object.entries(CLIPS0).map(([id, c]) => { const m = CLIPMETA[id] || {}; return [id, { ...c, ...(m.fit ? { fit: m.fit } : {}) }]; }));
const SP_CLIPS = '/tmp/claude-0/-home-user/c4ad3574-1e95-537a-ad7d-35e5b7703b6a/scratchpad/f28/clips/';
const CLIPDIR = (process.env.F28CLIPS || (fs.existsSync(SP_CLIPS) ? SP_CLIPS : ROOT + 'clips/')).replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
function frameAt(id, t, win) { const n = frameCount(id); if (!n) return 0; const off = (CLIPMETA[id] || {}).offset || 0; return Math.max(1, Math.min(n, Math.floor((t - win.start - off) * 30) + 1)); }
const framePath = (id, k) => `${CLIPDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const frameCache = new Map();
const CLIP_LEAD = 7;
export async function prepareClipFrames(T, t) {
  for (const id of Object.keys(CLIPS)) {
    const win = clipWin(T, id); if (!win || t < win.start - CLIP_LEAD || t > win.end + .8) continue;   // the plate grows over the lead-in sentence (3.4-5.8 s before the slot) and shows frame 1 meanwhile
    const k = frameAt(id, t, win); if (!k) continue;
    const f = framePath(id, k); if (frameCache.has(f)) continue;
    if (frameCache.size > 48) frameCache.delete(frameCache.keys().next().value);
    frameCache.set(f, await loadImage(fs.readFileSync(f)));
  }
}
function clipFrameAt(id, t, win) { const k = frameAt(id, t, win); return k ? frameCache.get(framePath(id, k)) || null : null; }
export function clipWin(T, id) { const c = T.clip && T.clip(id); return c ? { start: c.start, end: c.end } : null; }
// o: { from, morph 0..1 (0 = the source shape, 1 = CLIP_RECT), dark 0..1, credits (false = none), label 0..1 }
export function clipPlate(ctx, t, T, id, o = {}) {
  const R = CLIP_RECT, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], m = sineIO(clamp(o.morph ?? 1)), dark = clamp(o.dark ?? 0);
  const f = o.from ?? [R.x + R.w / 2, R.y + R.h / 2, 20];
  const fr0 = Array.isArray(f) ? { cx: f[0], cy: f[1], w: f[2] * 2, h: f[2] * 2, r: f[2] } : { cx: f.x + f.w / 2, cy: f.y + f.h / 2, w: f.w, h: f.h, r: Math.min(8, f.w / 2) };
  const cx = lerp(fr0.cx, R.x + R.w / 2, m), cy = lerp(fr0.cy, R.y + R.h / 2, m), w = lerp(fr0.w, R.w, m), h = lerp(fr0.h, R.h, m), rr = lerp(fr0.r, 14, m);
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
    if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy + 10, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .4, cy + h * .12, w * .8 * u, 3); ctx.globalAlpha = 1; }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  const lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {
    const by = R.y - 26;
    const nw = maskLine(ctx, [[info.name, 0]], R.x, by, 40, rise(lu), { glow: true });
    maskLine(ctx, [[[info.role, info.year].filter(Boolean).join(' · ').toUpperCase(), 0]], R.x + nw.w + 22, by - 2, 20, rise(lu), { serif: false, col: P.halo2, glow: false });
    maskLine(ctx, [['ORIGINAL FOOTAGE', 0]], R.x + R.w - measure('ORIGINAL FOOTAGE', 20, false), by - 2, 20, rise(lu), { serif: false, col: P.halo0, glow: false });
  }
  ctx.restore();
  return { cx, cy, w, h };
}
// on-screen texts (text-v2.md [EINBLENDUNG …]; the fact check of 11.11., faktencheck.md, overrides). quoted: true = verbatim (curly quotes)
export const QUOTES = {
  harrell: { lines: ['It is like you are trapped.'], quoted: true, attr: 'CASEY HARRELL · UC DAVIS HEALTH · AUG 2024', gold: 'trapped' },
};
export const SOURCES = {   // source lines (screen bottom left, F.source), in film order
  tehiku: 'TE HIKU MEDIA · NEURIPS KEYNOTE 2020',
  lionbridge: 'THE SPINOFF 2022 · MIT TECHNOLOGY REVIEW 2022',
  apate: 'APATE.AI / PARTNERS · ALL FIGURES: THE COMPANY',
  identiflight: 'J. APPL. ECOL. 2021 · ONE WIND FARM',
  nazca: 'SAKAI ET AL., PNAS 2024',
  mars: 'UNEP · IEA',
  harrell: 'NEJM 2024 · NATURE MEDICINE 2026 · ONE PARTICIPANT, RESEARCH STUDY',
  gfw: 'PAOLO ET AL., NATURE 2024',
  forcedlabour: 'MCDONALD ET AL., PNAS 2020 · METHOD DISPUTED (PNAS 2021)',
  guardian: 'NASA SVS · MARTIRE ET AL., NATURAL HAZARDS 2026',
  elephants: 'TAMIL NADU GOVERNMENT, JULY 2026',
  snakes: 'INDIA: ESTIMATE, ELIFE 2020 · ELEPHANTS: GOVERNMENT 2023/24',
  baker: 'VÁZQUEZ TORRES ET AL., NATURE 2025',
  debunk: 'COSTELLO, PENNYCOOK & RAND · SCIENCE 2024',
  debunk2: 'COSTELLO ET AL., PREPRINT JAN 2026 · NOT YET PEER-REVIEWED',
  wmo: 'WMO',
  floodhub: 'GOOGLE, NOV 2024',
};
// ======================================================================================================================== CAMERA PATH
// camPath(t, K): a camera that glides THROUGH its keys [[t, cam], …] (monotone cubic in x, y and log distance to F0), instead of
// stopping at each key like E.camAt. The first and last keys are arrivals (speed eases to 0 there). Use E.camAt for the single
// expo-in/expo-out dives into a light (the flood doors), camPath for everything else.
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
// a cool light path (the machine's trail) along screen/design points, drawn from fraction u0 to u1 of its length
export function coolPath(ctx, pts, u0, u1, w = 5, a = 1) {
  if (u1 <= u0 || a <= 0) return null;
  const n = pts.length, i0 = Math.floor(clamp(u0) * (n - 1)), i1 = Math.max(i0 + 1, Math.floor(clamp(u1) * (n - 1)));
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha *= a; ctx.beginPath();
  for (let k = i0; k <= i1; k++) (k === i0 ? ctx.moveTo(pts[k][0], pts[k][1]) : ctx.lineTo(pts[k][0], pts[k][1]));
  ctx.strokeStyle = rgba(COOL.halo, .25); ctx.lineWidth = w * 4; ctx.stroke(); ctx.strokeStyle = COOL.body; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  return pts[i1];
}

// ======================================================================================================================== ANIMALS (shared)
// an elephant, flat silhouette, side view, facing o.dir (±1). (x, y) = between the feet on the ground, h = shoulder height.
// o { walk (phase, rad), col (body), heat 0..1 (the thermal look: warm glowing body), a, calf }
export function elephant(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const d = o.dir ?? 1, heat = clamp(o.heat ?? 0), ph = o.walk ?? 0, col = o.col ?? mixHex(INK.mid, mixHex(P.halo0, P.coat, .5), heat);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(d * h / 100, h / 100);
  if (heat > 0) halo(ctx, 0, -80, 190, .55 * heat, P.halo0, P.core1);
  ctx.fillStyle = col;
  const leg = (lx, k) => { const sw = Math.sin(ph + k) * 9; ctx.beginPath(); ctx.roundRect(lx + sw * .3 - 9, -62, 19, 62, 6); ctx.fill(); ctx.beginPath(); ctx.ellipse(lx + sw * .5, -2, 11, 4, 0, 0, TAU); ctx.fill(); };
  leg(-38, 0); leg(26, Math.PI);
  ctx.beginPath(); ctx.ellipse(-4, -86, 62, 42, -.04, 0, TAU); ctx.fill();                                  // body
  ctx.beginPath(); ctx.ellipse(58, -98, 30, 30, 0, 0, TAU); ctx.fill();                                    // head
  ctx.beginPath(); ctx.moveTo(78, -96); ctx.quadraticCurveTo(96, -60, 84 + 4 * Math.sin(t * 1.2), -18); ctx.lineWidth = 13; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke();   // trunk
  ctx.fillStyle = mixHex(col, P.night1, .25 * (1 - heat)); ctx.beginPath(); ctx.ellipse(44, -96, 20, 28, .2 + .06 * Math.sin(t * 1.7), 0, TAU); ctx.fill();   // ear
  ctx.fillStyle = col; leg(-22, Math.PI * .9); leg(40, .2);
  ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-64, -96); ctx.quadraticCurveTo(-74, -80 + 3 * Math.sin(t * 2), -70, -62); ctx.stroke();
  ctx.restore();
}
