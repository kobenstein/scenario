// Film 55 · "The Best AI Is Locked Away" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText, the 2.5D card stage cam3/card/aim/camAt/camDrift, finish)
// + lib/f16_kit.mjs (rise, maskLine, measure, quote, stamp). World: docs/MOTION.md §2. Shots: docs/shots.md. World + seams: lib/f55_seams.mjs.
//
//   THE LINE (the one world, thumbnail A as an ANCHOR): a night plain, a colossal wall block with ONE colossal closed door far away.
//   Gold light leaks from the gap around it (the best A.I. is behind it) and falls over the floor toward you. In front of it, a line of people on five numbered
//   floor marks: 1 THE LAB · 2 GOVERNMENT · 3 BIG COMPANIES · 4 DEFENDERS · 5 YOU (the yellow coat) · then everyone, to the horizon.
//   THE PROOF TAPE (the through-line object): a paper strip of proof lines, each line gets a small cyan check. It comes out of the gap in
//   the hook ("Not sums. Proofs."), carries Fermat (11 DAYS → 30 HOURS) and returns in the big answer.
//   CALENDAR SHEETS are the only time device (never a clock, never a stopwatch). CORES (gold rhombs) are the machines: the same core sits
//   behind the door and in your phone. The CLIPBOARD is the inspector's tool (never a magnifier). QUOTE CARDS replace all footage.
//
// API (design px = screen px at the home camera; t in seconds; u = 0..1 growth):
//   colours: GOLD (the best A.I., the light behind the door, cores) · CHECK (THE accent of #55, cyan: checked / verified / evidence;
//            ticks, "computer-checked", WHO CHECKED IT?, outside testers) · INK (night forms) · LAMP (people's practical light: phone,
//            kitchen lamp; cream) · STONE (the wall and the door leaves) · the yellow coat = only you (E.du) · PRINT55 (finish) · bump(t, t0, d)
//   accentSpan(ctx, pts, u0, u1, o { col, w, a, spark }) · accentTrail(ctx, pts, u, o) · accentText(ctx, segs [[txt, m 0..1]], x, y, size, u, o)
//   door(ctx, t, x, y, w, h, o { gap 0..1, open 0..1, breath, sign, signU, a })   (x, y) = bottom centre → { x0, x1, top, y, lock }
//   floorMark(ctx, t, x, y, s, n, o { lit 0..1, a, sub })        a numbered plate painted on the floor (x, y) = centre on the floor
//   queuer(ctx, t, x, y, h, o { seed, kind 'lab'|'gov'|'suit'|'tools'|'hood'|'plain', dir, look, gold 0..1 (door light on them), a, walk, view })
//   crowd(ctx, t, x, y, h, o { n, gap, seed, kind, gold, a, look })  n queuers to the LEFT of x (a station's group, facing the door)
//   phone(ctx, t, x, y, s, o { lit 0..1, screen(ctx, w, h), rot, a, core 0..1 })   (x, y) = centre, s = height → screen rect (local)
//   core(ctx, t, x, y, s, o { glow 0..1, dim 0..1 (an older, matte machine), a, label })   the machine: a faceted gold rhomb, never a circle
//   proofTape(ctx, t, x, y, w, len, o { rows (written, float), ticks (checked, float), seed, a, roll, pitch, flow (px the paper slid) })
//   calSheet(ctx, t, x, y, s, top, sub, o { rot, a, dim }) · calStack(ctx, t, x, y, s, n, top, sub, o)   (x, y) = top centre
//   clipboard(ctx, t, x, y, s, o { title, rows: [[text, tick 0..1, empty-blink 0..1]], a })   (x, y) = top centre
//   checkMark(ctx, x, y, s, u, o { col, w }) · crossMark(...)
//   codeWall(ctx, t, x, y, w, h, o { seed, hot (row), hotU 0..1, dust 0..1, a, rowH })   code lines as masonry; one hot line glows gold
//   docSheet(ctx, t, x, y, s, o { title, lines, band, bandU, a, rot })   a paper (government document, report); band = a stamped strip
//   priceTag(ctx, t, x, y, text, u, o) (= tag in gold) · tag · questionMark · dotField · ruler · slab · slabBars · bracket · label
//   QUOTES · quoteCard(ctx, t, T, o { id 'A1'|'C1'|'C4'|'R1', x, y, w, size, a, credit 0..1, dim, hi: [[phrase, t0]] })   (no footage, ever)
//   portal(ctx, from {x,y,w,h}, to {x,y,w,h}, m 0..1, inside(ctx, w, h, m), o { r, rim, a })   a lit rect that grows from a thing into
//            a panel (the phone screen → the kitchen, the door gap → a glimpse inside); inside draws in panel-local px (to.w × to.h)
//   veil(ctx, a) · screenFloat(ctx, t, k) · source(ctx, t, t0, t1, text) · SOURCES · thesis(ctx, t, x, y, u, o { lines, size, out })
//   camPath(t, K) (monotone cubic through camera keys, log distance) · spark(ctx, t, x, y, r, o) (gold)
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
// NO QR overlay anywhere (rule 16.11.2026): no quiet corner, no window.
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, quote, rule, maskLine, measure, stamp } = K16;
export const { du, person, cam3, card, camAt, camDrift, aim, project, F0, glowText, withOuter, catmull, trail, dust, cardM } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };
const TAU = Math.PI * 2;
// THE PAPER: a fine print grain that lies on the world's surfaces and slides slowly (~0.5 px/frame) with a little of the camera's pan.
// It keeps the flat night surfaces alive between the 10 Hz grain refreshes ("nothing stands still"; calm.py static share) without a
// visible effect: 2-px cells, alpha <= .045. Drawn by S.lineWorld (after the wall and floor, BEFORE the people), S.kitchen, S.room.
// Built once (module level), never per frame. paper(ctx, t, o { x, y (px pan), a })
const PAPER = (() => { const n = 192, cv = createCanvas(n, n), g = cv.getContext('2d'), r = prng(5590);
  for (let y = 0; y < n; y += 2) for (let x = 0; x < n; x += 2) { const v = r(); if (v < .32) { g.fillStyle = `rgba(0,0,0,${(.25 + r() * .5).toFixed(3)})`; g.fillRect(x, y, 2, 2); } else if (v > .7) { g.fillStyle = `rgba(255,236,200,${(.2 + r() * .45).toFixed(3)})`; g.fillRect(x, y, 2, 2); } }
  return { cv, n, pats: new WeakMap() }; })();
export function paper(ctx, t, o = {}) {
  let pat = PAPER.pats.get(ctx); if (!pat) { pat = ctx.createPattern(PAPER.cv, 'repeat'); PAPER.pats.set(ctx, pat); }
  const n = PAPER.n, ox = (((o.x ?? 0) + t * 15.1) % n + n) % n, oy = (((o.y ?? 0) + t * 5.3) % n + n) % n;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, -ox, -oy); ctx.globalAlpha = .09 * (o.a ?? 1); ctx.fillStyle = pat; ctx.fillRect(0, 0, W + n, H + n); ctx.restore();
}

export const PRINT55 = { grain: 14, floor: 4, vig: .5 };
// colour code (docs/MOTION.md §5)
// the door's gold is the thumbnail's amber (richer than the editorial halo); the coat stays a separate, more lemon yellow (P.coat)
export const GOLD = { core: '#ffe8a8', body: '#ffcf6a', halo: '#f3a93c', line: '#ffc65a', deep: '#8a5520', text: '#ffe2a2', ink: '#e8ad55' };
export const CHECK = { core: '#effcff', body: '#8fe6ff', line: '#bdf2ff', deep: '#1d6a86', halo: '#5cc9e8', text: '#c9f4ff', ink: '#8fe0f4' };
export const INK = { far: mixHex(P.ind0, P.blue0, .35), mid: mixHex(P.night1, P.ind1, .6), near: P.night1, deep: P.night0, rim: mixHex(P.blue1, P.halo2, .25) };
export const LAMP = { core: P.cream, body: mixHex(P.cream, P.halo2, .35), deep: mixHex(P.halo2, P.night1, .55) };
export const STONE = { top: mixHex(P.night0, P.ind0, .4), mid: mixHex(P.night1, P.ind2, .55), low: mixHex(P.ind2, P.blue1, .22), leaf: mixHex(P.night1, P.ind1, .5), leafLit: mixHex(P.ind2, P.blue1, .5) };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ======================================================================================================================== ACCENT LIGHT
// the accent light line (three passes: glow, body, core, and a spark at the head). pts [[x, y]…]. o.col = CHECK (default) | GOLD
export function accentSpan(ctx, pts, u0, u1, o = {}) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), i]; };
  const [sx, sy, i0] = at(u0 * L), [ex, ey, i1] = at(u1 * L), sub = [[sx, sy]];
  for (let i = i0; i < i1; i++) sub.push([pts[i][0], pts[i][1]]);
  sub.push([ex, ey]);
  const w = o.w ?? 3, a = o.a ?? 1, col = o.col ?? CHECK;
  for (const [k, al, c, op] of [[4.5, .22, col.halo, 'lighter'], [2.1, .8, col.body, 'source-over'], [.9, 1, col.core, 'source-over']]) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = c; ctx.globalAlpha = al * a; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
  }
  if (o.spark !== false && u1 < 1) halo(ctx, ex, ey, w * 11, .7 * a, col.halo, col.core);
  return [ex, ey];
}
export const accentTrail = (ctx, pts, u = 1, o = {}) => accentSpan(ctx, pts, 0, u, o);
// maskLine with accent words: segs [[text, m 0..1]…] (m 1 = the word in the accent colour; o.acc = CHECK (default) | GOLD)
export function accentText(ctx, segs, x, y, size, u, o = {}) {
  const serif = o.serif ?? true, k = expoOut(clamp(u)), dy = (1 - k) * size * 1.15, acc = o.acc ?? CHECK;
  const mw = (txt) => measure(txt, size, serif, o.weight) + (o.spacing ? txt.length * size * o.spacing : 0);
  const total = segs.reduce((s, [txt]) => s + mw(txt), 0);
  let xx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x; const xs = [];
  ctx.save(); ctx.beginPath(); ctx.rect(xx - size, y - size * 1.25, total + size * 2, size * 1.25 + size * .32); ctx.clip();
  for (const [txt, m] of segs) {
    xs.push(xx);
    const col = mixHex(o.col ?? P.cream, acc.ink, clamp(m));
    E.glowText(ctx, txt, xx, y + dy, { size, serif, col, weight: o.weight, glow: o.glow ?? false, spacing: o.spacing });
    if (m > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; E.glowText(ctx, txt, xx, y + dy, { size, serif, col: rgba(acc.halo, .3), a: clamp(m), weight: o.weight, glow: false, spacing: o.spacing }); ctx.restore(); }
    xx += mw(txt);
  }
  ctx.restore();
  return { w: total, xs, x0: xs[0] };
}

// ======================================================================================================================== THE DOOR
// The colossal closed door (thumbnail A): ONE dark leaf in a deep frame, set in the wall. Gold light leaks through the gap AROUND it (top and
// the lock side bright, the hinge side faint) and under it onto the floor. NO handle (you can't open it from outside). (x, y) = bottom centre
// (the threshold), w × h = the opening, in local px (lib/f55_seams.mjs draws it in world units). o.gap 0..1 (the leak, breathing),
// o.open 0..1 (the leaf swings in a little: June, "the door opened. Partly." — the gold opening on the lock side widens to ~40 % of w),
// o.sign / o.signU (a name over the door: MYTHOS …), o.a. Returns { x0, x1, top, y, lock } (local px) so callers can grow things out of it.
const DOOR_SEED = prng(5501), DOOR_SPECK = Array.from({ length: 50 }, () => [DOOR_SEED(), DOOR_SEED(), DOOR_SEED()]);
export function door(ctx, t, x, y, w, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const gap = clamp(o.gap ?? 1), open = clamp(o.open ?? 0), br = 1 + (o.breath ?? .05) * Math.sin(t * .7 + .4) + .02 * Math.sin(t * 1.9);
  const g = gap * br, x0 = x - w / 2, x1 = x + w / 2, top = y - h, e = w * .012, fr = w * .06;
  ctx.save(); ctx.globalAlpha *= a;
  // the deep frame (a recess darker than the wall), a blue rim on its outer edge
  ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.fillRect(x0 - fr, top - fr, w + fr * 2, h + fr);
  ctx.fillStyle = rgba(INK.rim, .22); ctx.fillRect(x0 - fr, top - fr, w + fr * 2, Math.max(1, w * .003)); ctx.fillRect(x0 - fr, top - fr, Math.max(1, w * .003), h + fr);
  // the opening behind the leaf: gold (seen only through the gap, or wide when the leaf swings in)
  ctx.fillStyle = lin(ctx, 0, top, 0, y, [[0, mixHex(GOLD.halo, GOLD.body, .4)], [.6, GOLD.body], [1, GOLD.core]]); ctx.fillRect(x0, top, w, h);
  // the leaf: hinged on the left; it narrows when it swings in (perspective), leaving gold on the lock side
  const lw = (w - e * 2.2) * (1 - .42 * open), lx = x0 + e * .35, ly = top + e, lh = h - e * 1.6;
  ctx.fillStyle = lin(ctx, lx, 0, lx + lw, 0, [[0, P.night1], [.6, mixHex(P.night1, P.ind2, .6)], [1, mixHex(P.ind2, P.blue0, .3)]]); ctx.fillRect(lx, ly, lw, lh);
  ctx.fillStyle = lin(ctx, 0, ly, 0, ly + lh, [[0, rgba(P.night0, .35)], [.7, rgba(P.night0, 0)], [1, rgba(GOLD.halo, .08 * g)]]); ctx.fillRect(lx, ly, lw, lh);
  // the gold falls back onto the leaf from the lock side and the threshold (the thumbnail's warm lower right)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, lx + lw, ly + lh, Math.max(lw, lh) * .75, [[0, rgba(GOLD.halo, .3 * g)], [.45, rgba(GOLD.halo, .1 * g)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(lx, ly, lw, lh);
  ctx.restore();
  // the edge of the leaf on the lock side catches the light (it shows its thickness when it swings in)
  if (open > 0) { ctx.fillStyle = mixHex(P.ind2, GOLD.deep, .5); ctx.fillRect(lx + lw, ly, w * .025 * open, lh); }
  // grain specks on the leaf (stipple, seeded, still)
  for (const [u, v, s2] of DOOR_SPECK) { ctx.fillStyle = rgba(P.blue1, .05 + .06 * s2); ctx.fillRect(lx + u * lw, ly + v * lh, w * .004 * (1 + s2), w * .004 * (1 + s2)); }
  // the leak: a wide soft glow along the top and the lock side, faint on the hinge side, strong at the threshold
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  // soft strips (gradients across each edge, so no box ever shows): lock side, top, hinge side (faint); painted, not added (gold + blue = grey)
  ctx.globalCompositeOperation = 'source-over';
  const lockX = lx + lw, R = w * .34;
  ctx.fillStyle = lin(ctx, lockX - R * .35, 0, lockX + R, 0, [[0, rgba(GOLD.halo, 0)], [.26, rgba(GOLD.halo, .3 * g)], [.3, rgba(GOLD.body, .42 * g)], [.4, rgba(GOLD.halo, .2 * g)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(lockX - R * .35, top - R * .5, R * 1.35, h + R * .5);
  ctx.fillStyle = lin(ctx, 0, top - R * .7, 0, top + R * .25, [[0, rgba(GOLD.halo, 0)], [.7, rgba(GOLD.halo, .26 * g)], [.74, rgba(GOLD.body, .3 * g)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(x0 - R * .2, top - R * .7, w + R * .5, R * .95);
  ctx.fillStyle = lin(ctx, x0 - R * .3, 0, x0 + R * .12, 0, [[0, rgba(GOLD.halo, 0)], [.7, rgba(GOLD.halo, .1 * g)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(x0 - R * .3, top, R * .42, h);
  ctx.restore();
  ctx.fillStyle = rgba(GOLD.core, .95 * g); ctx.fillRect(lx + lw, top, Math.max(1, x1 - lx - lw), h); ctx.fillRect(x0, top, w, Math.max(1, e * .9)); ctx.fillStyle = rgba(GOLD.body, .7 * g); ctx.fillRect(x0, top, Math.max(1, e * .3), h);
  // under the door: the threshold line and the light falling forward over the floor (the carpet itself is drawn by the world)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rgba(GOLD.core, .7 * g); ctx.fillRect(x0, y - e * .7, w, e * .7);
  ctx.fillStyle = lin(ctx, 0, y - h * .25, 0, y, [[0, rgba(GOLD.halo, 0)], [1, rgba(GOLD.halo, .12 * g)]]); ctx.fillRect(x0 - fr, y - h * .25, w + fr * 2, h * .25);
  // dust in the leak (slow, seeded) on the lock side
  for (const [u, v, s2] of DOOR_SPECK) {
    const py = top + ((v - t * .008 * (.5 + s2)) % 1 + 1) % 1 * h, px = lx + lw + (u - .3) * w * .12 + w * .01 * Math.sin(t * .5 + u * 9);
    ctx.fillStyle = rgba(GOLD.core, (.1 + .3 * s2) * g * (.6 + .4 * Math.sin(t * .9 + v * 7))); ctx.fillRect(px, py, w * .003 * (1 + s2), w * .003 * (1 + s2));
  }
  ctx.restore();
  if (o.sign && (o.signU ?? 1) > 0) maskLine(ctx, [[o.sign, 0]], x, top - fr * 1.9, fr * 1.3, o.signU ?? 1, { serif: false, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .2 });
  ctx.restore();
  return { x0, x1, top, y, lock: lx + lw };
}

// ======================================================================================================================== THE LINE
// a numbered plate painted on the floor (seen from slightly above): (x, y) = centre on the floor, s = width. o.lit 0..1 (it lights when
// the camera or the voice reaches it), o.sub = a small caps word on the plate's front edge (THE LAB …)
export function floorMark(ctx, t, x, y, s, n, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 0); if (a <= 0) return;
  const d = s * .2, sk = s * .18;
  ctx.save(); ctx.globalAlpha *= a;
  const p = new Path2D(); p.moveTo(x - s / 2 + sk, y - d / 2); p.lineTo(x + s / 2 + sk, y - d / 2); p.lineTo(x + s / 2 - sk, y + d / 2); p.lineTo(x - s / 2 - sk, y + d / 2); p.closePath();
  if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x, y, s * .9, [[0, rgba(GOLD.halo, .2 * lit)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(x - s, y - s * .5, s * 2, s); ctx.restore(); }
  ctx.fillStyle = mixHex(mixHex(P.ind1, P.blue1, .35), mixHex(GOLD.line, P.cream, .4), lit * .85); ctx.fill(p);
  ctx.strokeStyle = rgba(mixHex(P.blue1, GOLD.core, lit), .55 + .4 * lit); ctx.lineWidth = Math.max(1.2, s * .012); ctx.stroke(p);
  // the numeral, painted flat on the plate (squashed: it lies on the floor)
  ctx.save(); ctx.translate(x, y + d * .18); ctx.scale(1, .36); ctx.transform(1, 0, -.42, 1, 0, 0);
  E.glowText(ctx, String(n), 0, s * .1, { size: s * .62, serif: true, align: 'center', col: lit > .5 ? P.night1 : mixHex(P.cream, P.blue1, .3), glow: false });
  ctx.restore();
  if (o.sub) { ctx.save(); ctx.translate(x, y + d * .5 + s * .1); E.glowText(ctx, o.sub, 0, 0, { size: s * .085, align: 'center', weight: 600, spacing: .14, col: rgba(mixHex(P.halo2, P.cream, lit), .55 + .45 * lit), glow: false }); ctx.restore(); }
  ctx.restore();
}
// one person in the line (indigo silhouette; the door light rims them gold). kind: 'lab' (long coat, light rim) · 'gov' (coat, a folder) ·
// 'suit' (short jacket, a badge) · 'tools' (a tool case) · 'hood' (hooded: someone at the back) · 'plain'. They breathe and shift weight.
export function queuer(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const r = prng(o.seed ?? 1), ph = r() * TAU, kind = o.kind ?? 'plain', g = clamp(o.gold ?? 0);
  const breath = Math.sin(t * (1.05 + r() * .25) + ph), lean = .015 * Math.sin(t * .23 + ph * 2) + (r() - .5) * .04;
  const rim = mixHex(P.blue1, GOLD.halo, .25 + .7 * g);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(1, 1 + .006 * breath);
  const hands = E.person(ctx, 0, 0, h * (.94 + r() * .1), { pose: o.walk != null ? 'walk' : 'stand', walk: o.walk, view: o.view, dir: o.dir ?? 1, look: o.look ?? (.1 + r() * .2), lean, light: o.light ?? 1, back: .35 + .5 * g, rim, long: kind === 'lab' || kind === 'gov' || kind === 'hood', armR: kind === 'gov' || kind === 'tools' ? [.35, .25] : undefined });
  if (kind === 'lab') { ctx.fillStyle = rgba(P.cream, .22 + .2 * g); ctx.fillRect(-h * .02 * (o.dir ?? 1), -h * .78, h * .025, h * .5); }
  if (kind === 'gov' && hands?.R) { const [hx, hy] = [hands.R[0] - x, hands.R[1] - y]; ctx.fillStyle = mixHex(P.cream, P.halo2, .5); ctx.fillRect(hx - h * .02, hy - h * .16, h * .1, h * .14); ctx.fillStyle = rgba(CHECK.deep, .8); ctx.fillRect(hx + h * .02, hy - h * .07, h * .04, h * .025); }
  if (kind === 'tools' && hands?.R) { const [hx, hy] = [hands.R[0] - x, hands.R[1] - y]; ctx.fillStyle = mixHex(P.night0, P.ind1, .6); ctx.fillRect(hx - h * .09, hy, h * .18, h * .11); ctx.fillStyle = rgba(rim, .6); ctx.fillRect(hx - h * .09, hy, h * .18, h * .012); }
  if (kind === 'suit') { ctx.fillStyle = rgba(GOLD.line, .35 + .3 * g); ctx.fillRect(h * .03 * (o.dir ?? 1), -h * .68, h * .03, h * .04); }
  if (kind === 'hood') { ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.beginPath(); ctx.ellipse(-h * .005 * (o.dir ?? 1), -h * .885, h * .085, h * .092, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
  return hands;
}
// a station's group: n people standing in line to the LEFT of x (they face the door on the right), spaced by gap·h
export function crowd(ctx, t, x, y, h, o = {}) {
  const n = o.n ?? 3, gp = o.gap ?? .42;
  for (let k = n - 1; k >= 0; k--) queuer(ctx, t, x - k * h * gp, y + (k % 2 ? 2 : 0), h * (k % 3 === 1 ? .96 : 1), { seed: (o.seed ?? 1) * 31 + k * 7, kind: Array.isArray(o.kind) ? o.kind[k % o.kind.length] : o.kind, gold: o.gold, a: o.a, look: o.look, dir: o.dir });
}

// ======================================================================================================================== THINGS
// the phone: (x, y) = centre, s = height. o.lit 0..1 (screen light, cream), o.screen(ctx, w, h) draws in screen-local px (clipped),
// o.core 0..1 shows the small gold core in the screen (the machine you have). Returns the screen rect in the caller's px.
export function phone(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const w = s * .5, lit = clamp(o.lit ?? 1), r = s * .08, sw = w * .88, sh = s * .9;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  if (lit > 0) halo(ctx, 0, 0, s * 1.2, .22 * lit, LAMP.body, LAMP.core);
  ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.roundRect(-w / 2, -s / 2, w, s, r); ctx.fill();
  ctx.strokeStyle = rgba(INK.rim, .5); ctx.lineWidth = Math.max(1, s * .012); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.roundRect(-sw / 2, -sh / 2, sw, sh, r * .7); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, -sh / 2, 0, sh / 2, [[0, mixHex(P.ind1, LAMP.body, .55 * lit)], [1, mixHex(P.night1, LAMP.deep, .5 * lit)]]); ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
  if (o.core > 0) core(ctx, t, 0, -sh * .12, sw * .42, { glow: o.core, a: o.core });
  if (o.screen) { ctx.translate(-sw / 2, -sh / 2); o.screen(ctx, sw, sh); }
  ctx.restore(); ctx.restore();
  return { x: x - sw / 2, y: y - sh / 2, w: sw, h: sh };
}
// the machine: a faceted gold rhomb (light from the top left), breathing; o.dim → a matte, older machine (blue-grey); o.label below
export function core(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 0) return;
  const gl = clamp(o.glow ?? 1), dm = clamp(o.dim ?? 0), br = 1 + .03 * Math.sin(t * 1.3 + x * .01);
  const hw = s * .36 * br, hh = s * .5 * br, c = (k) => mixHex(k, mixHex(P.blue1, P.halo2, .25), dm * .8);
  ctx.save(); ctx.globalAlpha *= a;
  if (gl > 0) halo(ctx, x, y, s * 1.4, (.42 - .3 * dm) * gl, c(GOLD.halo), c(GOLD.core));
  const tri = (p, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(...p[0]); ctx.lineTo(...p[1]); ctx.lineTo(...p[2]); ctx.closePath(); ctx.fill(); };
  const T0 = [x, y - hh], R0 = [x + hw, y], B0 = [x, y + hh], L0 = [x - hw, y], C0 = [x - hw * .12, y - hh * .1];
  tri([T0, L0, C0], c(GOLD.core)); tri([T0, R0, C0], c(GOLD.body)); tri([L0, B0, C0], c(GOLD.halo)); tri([R0, B0, C0], c(GOLD.deep));
  ctx.strokeStyle = rgba(c(GOLD.core), .6); ctx.lineWidth = Math.max(1, s * .015); ctx.beginPath(); ctx.moveTo(...T0); ctx.lineTo(...R0); ctx.lineTo(...B0); ctx.lineTo(...L0); ctx.closePath(); ctx.stroke();
  if (o.label) E.glowText(ctx, o.label, x, y + hh + s * .32, { size: Math.max(12, s * .2), align: 'center', weight: 600, spacing: .14, col: P.cream, glow: false });
  ctx.restore();
}
// THE PROOF TAPE: a paper strip unrolling downward from (x, y) (top left), w wide, len long (visible). Each row = a proof line (ink dashes);
// o.rows = rows written so far (float: the last one writes itself left → right), o.ticks = rows checked (a small cyan tick at the row end).
// o.flow (px) slides the paper up (the tape keeps running), o.roll = draws the roll at the top. Seeded per row (o.seed).
const TAPE = new Map();
export function proofTape(ctx, t, x, y, w, len, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || len <= 0) return;
  const pitch = o.pitch ?? w * .17, seed = o.seed ?? 3, rows = o.rows ?? 1e9, ticks = o.ticks ?? 0, flow = o.flow ?? 0;
  if (!TAPE.has(seed)) { const r = prng(seed * 977), arr = []; for (let k = 0; k < 400; k++) { const segs = [], n = 2 + Math.floor(r() * 3); let xx = r() * .12; for (let j = 0; j < n && xx < .72; j++) { const l = .08 + r() * .2; segs.push([xx, Math.min(.74, xx + l), r() < .22]); xx += l + .04 + r() * .05; } arr.push(segs); } TAPE.set(seed, arr); }
  const R = TAPE.get(seed);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(x + w * .04, y + 6, w, len);   // a soft shadow on what is under it
  ctx.fillStyle = lin(ctx, 0, y, 0, y + len, [[0, mixHex(P.cream, '#e9e1c4', .5)], [1, mixHex(P.cream, P.halo2, .45)]]); ctx.fillRect(x, y, w, len);
  ctx.beginPath(); ctx.rect(x, y, w, len); ctx.clip();
  const k0 = Math.max(0, Math.floor(flow / pitch) - 1);
  for (let k = k0; k < k0 + Math.ceil(len / pitch) + 2; k++) {
    if (k >= rows) break;
    const ry = y + (k + .7) * pitch - flow; if (ry < y - pitch || ry > y + len + pitch) continue;
    const wr = clamp(rows - k), segs = R[k % R.length];
    ctx.strokeStyle = rgba(mixHex(P.night1, P.ind2, .4), .82); ctx.lineWidth = Math.max(1.2, pitch * .14); ctx.lineCap = 'round';
    for (const [s0, s1, sym] of segs) {
      const e = Math.min(s1, s0 + (s1 - s0) * clamp((wr * .78 - s0) / Math.max(1e-3, s1 - s0)));
      if (e <= s0) continue;
      ctx.beginPath(); ctx.moveTo(x + w * (.06 + s0), ry); ctx.lineTo(x + w * (.06 + e), ry); ctx.stroke();
      if (sym && e >= s1) { ctx.beginPath(); ctx.arc(x + w * (.06 + s1) + pitch * .22, ry, pitch * .1, 0, TAU); ctx.stroke(); }
    }
    const tk = clamp(ticks - k); if (tk > 0) checkMark(ctx, x + w * .9, ry, pitch * .52, tk, { w: Math.max(1.4, pitch * .1) });
  }
  ctx.restore();
  if (o.roll !== false) {   // the roll it comes from (a cylinder seen from the side)
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = lin(ctx, 0, y - w * .1, 0, y + w * .06, [[0, mixHex(P.cream, P.halo2, .6)], [1, mixHex(P.halo2, P.shade1, .5)]]);
    ctx.beginPath(); ctx.roundRect(x - w * .04, y - w * .1, w * 1.08, w * .16, w * .08); ctx.fill(); ctx.restore();
  }
}
// one calendar sheet (the only time device of the film: never a clock). (x, y) = top centre, s = width. top = big serif (YEARS, 11, APR 7),
// sub = small caps under it. o.rot, o.dim (an old, faded sheet)
export function calSheet(ctx, t, x, y, s, top, sub, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const h = s * 1.12, dm = clamp(o.dim ?? 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-s / 2 + s * .03, s * .04, s, h);
  ctx.fillStyle = mixHex(mixHex(P.cream, '#ece4c8', .5), P.blue1, dm * .5); ctx.fillRect(-s / 2, 0, s, h);
  ctx.fillStyle = mixHex(P.ind1, P.night1, .4); ctx.fillRect(-s / 2, 0, s, h * .17);                         // the binding band
  ctx.fillStyle = mixHex(P.cream, P.halo2, .5); ctx.fillRect(-s * .25, h * .06, s * .06, h * .05); ctx.fillRect(s * .19, h * .06, s * .06, h * .05);
  if (top) E.glowText(ctx, String(top), 0, h * .66, { size: s * (String(top).length > 4 ? .26 : .5), serif: true, align: 'center', col: P.night1, glow: false });
  if (sub) E.glowText(ctx, sub, 0, h * .88, { size: s * .085, align: 'center', weight: 600, spacing: .12, col: mixHex(P.night1, P.blue1, .5), glow: false });
  ctx.restore();
}
// a pad of n calendar sheets (n float: the pad grows / shrinks smoothly; up to ~60 visible edges), the top sheet shows top / sub
export function calStack(ctx, t, x, y, s, n, top, sub, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || n <= 0) return;
  const edges = Math.min(60, n), th = s * .012 * (o.thick ?? 1);
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = Math.ceil(edges) - 1; k >= 1; k--) { ctx.fillStyle = k % 2 ? mixHex(P.cream, P.halo2, .55) : mixHex(P.cream, P.shade1, .45); ctx.fillRect(x - s / 2, y + s * 1.12 + (k - 1) * th - th * .5, s, th); }
  calSheet(ctx, t, x, y, s, top, sub, { dim: o.dim });
  ctx.restore();
}
// a tick drawn on (accent CHECK by default) · a cross (cream, never red)
export function checkMark(ctx, x, y, s, u, o = {}) {
  if (u <= 0) return;
  accentSpan(ctx, [[x - s * .42, y + s * .02], [x - s * .12, y + s * .32], [x + s * .46, y - s * .36]], 0, smooth(clamp(u)), { w: o.w ?? s * .08, col: o.col ?? CHECK, spark: false, a: o.a ?? 1 });
}
export function crossMark(ctx, x, y, s, u, o = {}) {
  if (u <= 0) return; const e = smooth(clamp(u * 2)), f = smooth(clamp(u * 2 - 1)), r = s * .36;
  ctx.save(); ctx.strokeStyle = rgba(P.cream, .85 * (o.a ?? 1)); ctx.lineWidth = o.w ?? s * .08; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - r, y - r); ctx.lineTo(x - r + 2 * r * e, y - r + 2 * r * e); if (f > 0) { ctx.moveTo(x + r, y - r); ctx.lineTo(x + r - 2 * r * f, y - r + 2 * r * f); } ctx.stroke(); ctx.restore();
}
// the inspector's clipboard (never a magnifier): (x, y) = top centre, s = width. rows: [[text, tick 0..1, blink 0..1]] → a box per row,
// an empty box can blink (WHO CHECKED IT?), a tick lands in CHECK.
export function clipboard(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const h = s * 1.35, rows = o.rows || [];
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-s / 2 + s * .03, s * .03, s, h);
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.beginPath(); ctx.roundRect(-s / 2, 0, s, h, s * .04); ctx.fill();
  ctx.fillStyle = mixHex(P.cream, '#ece4c8', .5); ctx.fillRect(-s * .43, s * .1, s * .86, h - s * .16);
  ctx.fillStyle = mixHex(P.blue1, P.halo2, .35); ctx.beginPath(); ctx.roundRect(-s * .18, -s * .04, s * .36, s * .12, s * .02); ctx.fill();
  if (o.title) E.glowText(ctx, o.title, -s * .36, s * .26, { size: s * .07, weight: 600, spacing: .12, col: P.night1, glow: false });
  rows.forEach(([txt, tk, bl], k) => {
    const ry = s * (.42 + k * .2), bx = -s * .36, bs = s * .09;
    ctx.strokeStyle = rgba(P.night1, .75); ctx.lineWidth = Math.max(1.2, s * .008); ctx.strokeRect(bx, ry - bs * .75, bs, bs);
    if (bl > 0) { ctx.fillStyle = rgba(CHECK.halo, .35 * bl * (.5 + .5 * Math.sin(t * 3.2))); ctx.fillRect(bx, ry - bs * .75, bs, bs); }
    if (txt) E.glowText(ctx, txt, bx + bs * 1.6, ry, { size: s * .062, weight: 600, spacing: .08, col: P.night1, glow: false });
    if (tk > 0) checkMark(ctx, bx + bs * .55, ry - bs * .3, bs * 1.5, tk, { w: s * .014 });
  });
  ctx.restore();
}
// computer code as masonry: rows of blocks (code lines) with indents; one hot line (o.hot) glows gold (o.hotU), dust falls from it (o.dust)
const CODE = new Map();
export function codeWall(ctx, t, x, y, w, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const rh = o.rowH ?? 30, n = Math.ceil(h / rh), seed = o.seed ?? 27;
  if (!CODE.has(seed)) { const r = prng(seed * 131), rowsA = []; let ind = 0; for (let k = 0; k < 400; k++) { ind = Math.max(0, Math.min(4, ind + (r() < .25 ? 1 : r() < .3 ? -1 : 0))); const b = []; let xx = ind * .05; while (xx < .92) { const l = .03 + r() * .14; if (xx + l > .96) break; b.push([xx, xx + l, r()]); xx += l + .012 + r() * .02; if (r() < .18) break; } rowsA.push(b); } CODE.set(seed, rowsA); }
  const RW = CODE.get(seed), hot = o.hot ?? -1, hu = clamp(o.hotU ?? 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  for (let k = 0; k < n; k++) {
    const ry = y + k * rh, isHot = k === hot;
    for (const [s0, s1, v] of RW[k % RW.length]) {
      const col = isHot ? mixHex(mixHex(P.ind2, P.blue1, .5), GOLD.body, hu) : mixHex(P.ind1, P.blue1, .25 + .35 * v);
      ctx.fillStyle = rgba(col, isHot ? .7 + .3 * hu : .55 + .25 * v); ctx.fillRect(x + w * s0, ry + rh * .22, w * (s1 - s0), rh * .56);
    }
    if (isHot && hu > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, ry - rh * 2, 0, ry + rh * 3, [[0, rgba(GOLD.halo, 0)], [.45, rgba(GOLD.halo, .3 * hu)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(x, ry - rh * 2, w, rh * 5); ctx.restore(); }
  }
  const du = clamp(o.dust ?? 0);
  if (hot >= 0 && du > 0) { const r = prng(seed + 7); for (let k = 0; k < 40; k++) { const px = x + r() * w, sp = .3 + r(), py = y + (hot + .8) * rh + ((t * 26 * sp + r() * 300) % 300); ctx.fillStyle = rgba(GOLD.line, du * (.25 + .4 * r()) * (1 - (py - y - hot * rh) / 330)); ctx.fillRect(px, py, 2, 2); } }
  ctx.restore();
}
// a paper (a government document, a report, an announcement): (x, y) = top centre, s = width. o.title (caps), o.lines (number of ink lines),
// o.band: a stamped strip across it (o.bandU 0..1, cream ink on indigo) — VOLUNTARY, HELD BACK …
export function docSheet(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const h = s * 1.3;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-s / 2 + s * .03, s * .03, s, h);
  ctx.fillStyle = mixHex(P.cream, '#ece4c8', .5); ctx.fillRect(-s / 2, 0, s, h);
  if (o.title) E.glowText(ctx, o.title, -s * .4, s * .16, { size: s * .07, weight: 600, spacing: .12, col: P.night1, glow: false });
  const r = prng((o.seed ?? 5) * 17);
  for (let k = 0; k < (o.lines ?? 7); k++) { ctx.fillStyle = rgba(P.night1, .35); ctx.fillRect(-s * .4, s * (.3 + k * .12), s * (.5 + r() * .3), s * .022); }
  const bu = clamp(o.bandU ?? (o.band ? 1 : 0));
  if (o.band && bu > 0) {
    ctx.save(); ctx.rotate(-.06); ctx.globalAlpha *= expoOut(bu);
    const bw = s * 1.04 * (1.2 - .2 * expoOut(bu)); ctx.fillStyle = rgba(P.ind1, .92); ctx.fillRect(-bw / 2, h * .55 - s * .08, bw, s * .16);
    E.glowText(ctx, o.band, 0, h * .55 + s * .04, { size: s * .085, weight: 600, spacing: .16, align: 'center', col: P.cream, glow: false }); ctx.restore();
  }
  ctx.restore();
}

// ======================================================================================================================== QUOTE CARDS
// NO FOOTAGE in this film (the cloud cannot download it): every [CLIP] and the [QUOTE CARD] is wall text. Name, role, where, when, the exact
// words. For a card the narrator reads (R1) each word lights as it is spoken; for a clip slot (A1, C1, C4: the speaker's own audio or
// silence) the words light evenly over the slot. Never a photo, never a likeness, never "ORIGINAL FOOTAGE" (that label only if real
// footage arrives later and replaces the card).
export const QUOTES = {
  A1: { text: 'And this internal model after Astra can do things that even the world’s best mathematicians cannot.', name: 'Sam Altman', role: 'CEO, OPENAI', where: 'ON STAGE · DREAMFORCE · SEP 15, 2026' },
  C1: { text: '…we get the next generation of models before anybody else.', name: 'Sam Altman', role: 'CEO, OPENAI', where: 'INTERVIEW WITH MATTHEW BERMAN · OCT 21, 2026' },
  C4: { text: 'The most concerning threats posed by rogue AI agents precede their external release.', name: 'Marius Hobbhahn', role: 'CEO, APOLLO RESEARCH', where: 'U.S. SENATE HEARING · SEP 30, 2026' },
  // R1 is NOT in the film since vo-v4 (the narrator only names the source: F.SOURCES.friar). Kept for reference, never draw it.
  R1: { text: 'We are still holding that model.', name: 'Sarah Friar', role: 'CFO, OPENAI', where: 'CNBC · NOV 6, 2026' },
};
const nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export function quoteCard(ctx, t, T, o = {}) {
  const id = o.id ?? 'A1', q = QUOTES[id], size = o.size ?? 64, wmax = o.w ?? 1240, lead = size * 1.24, a = o.a ?? 1; if (a <= 0 || !q) return null;
  const slot = T.clip(id), spoken = slot && slot.kind === 'card' ? T.words.filter((w) => w.s >= slot.start - .05 && w.s <= slot.end + .05) : [];
  const words = `“${q.text}”`.split(/\s+/), lines = []; let cur = [];
  for (const w of words) { const nx = [...cur, w]; if (cur.length && measure(nx.join(' '), size) > wmax) { lines.push(cur); cur = [w]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const flat = lines.flat(), L = flat.reduce((s, w) => s + w.length + 1, 0); let acc = 0;
  const tOf = flat.map((w, k) => { const even = slot ? lerp(slot.start + .15, slot.end - .4, acc / L) : 0; acc += w.length + 1; return spoken[k] && nz(spoken[k].w) === nz(w) ? spoken[k].s : even; });
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
      accentText(ctx, [[txt, m]], xx, yy, size, 1, { glow: lit > .5 && m === 0 });
      ctx.restore();
      xx += measure(txt, size, true);
    });
  });
  const by = y + (lines.length - 1) * lead + size * .5 + 34, cu = rise(clamp(o.credit ?? 1));
  if (cu > 0) {
    ctx.fillStyle = rgba(GOLD.line, .7 * cu); ctx.fillRect(x, by - 6, 64 * cu, 2);
    maskLine(ctx, [[q.name, 0]], x, by + 44, 40, cu, { glow: false });
    const nx = x + measure(q.name, 40) + 22;
    maskLine(ctx, [[q.role, 0]], nx, by + 41, 19, cu, { serif: false, weight: 600, col: P.cream, glow: false });
    maskLine(ctx, [[q.where, 0]], nx, by + 70, 19, rise(span(cu, .25, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  }
  ctx.restore();
  return { x, y, bottom: by + 80, lines: lines.length, lead };
}

// ======================================================================================================================== PORTAL, VEIL, FLOAT
// a lit rect that grows from a thing into a panel (or back): from / to in screen px, m 0..1 (sineIO it yourself). inside(ctx, w, h, m) draws
// in to-local px (to.w × to.h), scaled to the current rect and clipped. The rim is cream (o.rim = GOLD for a glimpse behind the door).
export function portal(ctx, from, to, m, inside, o = {}) {
  m = clamp(m); if (m <= 0 || !from) return null;
  const r = { x: lerp(from.x, to.x, m), y: lerp(from.y, to.y, m), w: lerp(from.w, to.w, m), h: lerp(from.h, to.h, m) }, rr = o.r ?? lerp(o.r0 ?? 6, o.r1 ?? 16, m);
  const a = o.a ?? 1, rim = o.rim ?? LAMP;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  if (o.glow !== false) halo(ctx, r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w, r.h) * .7, .16 * (1 - m * .6), rim.body ?? rim.halo, rim.core);
  ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, rr); ctx.clip();
  ctx.translate(r.x, r.y); const sx = r.w / to.w, sy = r.h / to.h, k = Math.max(sx, sy); ctx.translate((r.w - to.w * k) / 2, (r.h - to.h * k) / 2); ctx.scale(k, k);
  inside(ctx, to.w, to.h, m);
  ctx.restore();
  ctx.strokeStyle = rgba(rim.core, .55 * (o.rimA ?? 1)); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, rr); ctx.stroke();
  ctx.restore();
  return r;
}
export function veil(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, clamp(a)); ctx.fillRect(0, 0, W, H); ctx.restore(); }
// screen-space explainers float a little (never a frozen frame): a slow drift and breath about the centre, scaled by k
export function screenFloat(ctx, t, k = 1) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .014 * k * Math.sin(t * .37 + 1), dx = drift(t * 1.1, 12 * k, 11), dy = drift(t * 1.1, 7 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
}
export function spark(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1, col = o.col ?? GOLD; if (a <= 0 || r <= .2) return;
  halo(ctx, x, y, r * 7, .5 * a, col.halo, col.core);
  ctx.fillStyle = rgba(col.core, a); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}

// ======================================================================================================================== GENERIC EXPLAINER BLOCKS (from Film 54)
// a small paper tag on a string: (x, y) = where the string hangs; u grows it (it swings in). o.col 'gold' = a price tag
export function tag(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const size = o.size ?? 17, tw = measure(text, size, false, 600) + size * text.length * .1, w = tw + size * 1.6, h = size * 1.9, len = o.len ?? 22;
  const sw = (o.swing ?? 0) + (1 - expoOut(u)) * .5 + .02 * Math.sin(t * 1.1 + x * .01);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.globalAlpha *= rise(u);
  ctx.strokeStyle = rgba(P.halo2, .7); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, len); ctx.stroke();
  const y0 = len, p = new Path2D(); p.moveTo(-w / 2 + h * .35, y0); p.lineTo(w / 2, y0); p.lineTo(w / 2, y0 + h); p.lineTo(-w / 2 + h * .35, y0 + h); p.lineTo(-w / 2, y0 + h / 2); p.closePath();
  ctx.fillStyle = o.col === 'gold' ? mixHex(GOLD.body, GOLD.halo, .35) : mixHex(P.cream, '#e3dcc0', .4); ctx.fill(p);
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(-w / 2 + h * .42, y0 + h / 2, size * .14, 0, TAU); ctx.fill();
  E.glowText(ctx, text, -w / 2 + h * .7, y0 + h * .66, { size, weight: 600, spacing: .1, col: P.night1, glow: false });
  ctx.restore();
}
export const priceTag = (ctx, t, x, y, text, u, o = {}) => tag(ctx, t, x, y, text, u, { col: 'gold', ...o });
// a big serif question mark that rises (accent by default)
export function questionMark(ctx, t, x, y, s, u, o = {}) {
  if (u <= 0) return; ctx.save(); if (o.screen !== false) ctx.setTransform(1, 0, 0, 1, 0, 0);
  accentText(ctx, [['?', o.acc ?? 1]], x, y, s, rise(u), { align: 'center', acc: o.col }); ctx.restore();
}
// a field of dots (findings, people, copies): o { x, y, w, h, n, layout 'grid'|'scatter', cols, r, seed, u (grow, staggered), on(k) → 0..1, onCol (CHECK|GOLD), a }
const FIELD = new Map();
export function dotField(ctx, t, o) {
  const n = o.n, key = `${o.seed ?? 1}:${n}:${o.layout}`, a = o.a ?? 1; if (a <= 0) return;
  if (!FIELD.has(key)) { const r = prng(o.seed ?? 1), pts = []; for (let k = 0; k < n; k++) pts.push([r(), r(), r()]); FIELD.set(key, pts); }
  const pts = FIELD.get(key), cols = o.cols ?? Math.ceil(Math.sqrt(n * o.w / o.h)), rows = Math.ceil(n / cols), rr = o.r ?? 3, oc = o.onCol ?? CHECK;
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < n; k++) {
    const p = pts[k], e = rise(span(o.u ?? 1, p[2] * .7, p[2] * .7 + .3)); if (e <= 0) continue;
    const x = o.layout === 'grid' ? o.x + (k % cols + .5) * o.w / cols : o.x + p[0] * o.w, y = o.layout === 'grid' ? o.y + (Math.floor(k / cols) + .5) * o.h / rows : o.y + p[1] * o.h;
    const on = o.on ? clamp(o.on(k)) : 0;
    ctx.fillStyle = rgba(mixHex(P.blue1, oc.body, on), (.45 + .55 * on) * e); ctx.beginPath(); ctx.arc(x, y, rr * (.6 + .4 * e) * (.85 + .25 * on), 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// a ruler of light: o { x, y, w, u (the line grows), fill 0..1 (accent), ticks: [[v 0..1, label]], minor (count), label, a, col }
export function ruler(ctx, t, o) {
  const u = expoOut(clamp(o.u ?? 1)), a = o.a ?? 1, col = o.col ?? CHECK; if (u <= 0 || a <= 0) return;
  const { x, y, w } = o, f = Math.min(clamp(o.fill ?? 0), u);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * u, y); ctx.stroke();
  const mn = o.minor ?? 30; for (let k = 0; k <= mn; k++) { const v = k / mn; if (v > u) break; ctx.strokeStyle = rgba(P.blue1, .7); ctx.beginPath(); ctx.moveTo(x + w * v, y - 6); ctx.lineTo(x + w * v, y + 6); ctx.stroke(); }
  for (const [v, s] of o.ticks || []) { if (v > u + 1e-6) continue; ctx.strokeStyle = rgba(P.cream, .6); ctx.beginPath(); ctx.moveTo(x + w * v, y - 12); ctx.lineTo(x + w * v, y + 12); ctx.stroke(); E.glowText(ctx, s, x + w * v, y + 44, { size: 24, align: 'center', glow: false, col: col.text, spacing: .1 }); }
  if (f > 0) accentTrail(ctx, [[x, y], [x + w * f, y]], 1, { w: 5, spark: f < 1, col });
  if (o.label) E.glowText(ctx, o.label, x, y - 30, { size: 24, glow: false, spacing: .12, col: col.text, a: rise(span(u, .3, 1)) });
  ctx.restore();
}
// a slab of light as a bar: (x, y) = left end, centre line y. o { col 'gold'|'check'|'stone', u, a, label (left), value (right) }
export function slab(ctx, t, x, y, len, th, o = {}) {
  const u = expoOut(clamp(o.u ?? 1)), L = Math.max(2, len * u), a = o.a ?? 1; if (a <= 0) return;
  const col = o.col ?? 'stone', C = col === 'gold' ? [GOLD.core, GOLD.body, GOLD.deep] : col === 'check' ? [CHECK.core, CHECK.body, CHECK.deep] : [mixHex(P.blue1, P.blue0, .3), INK.mid, P.night0];
  ctx.save(); ctx.globalAlpha *= a; const d = th * .5;
  if (col === 'gold') halo(ctx, x + L * .5, y, Math.max(L * .6, th * 2), .16, GOLD.halo, GOLD.body);
  ctx.fillStyle = C[0]; ctx.beginPath(); ctx.moveTo(x, y - th / 2); ctx.lineTo(x + L, y - th / 2); ctx.lineTo(x + L + d * .6, y - th / 2 - d * .5); ctx.lineTo(x + d * .6, y - th / 2 - d * .5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = C[2]; ctx.beginPath(); ctx.moveTo(x + L, y - th / 2); ctx.lineTo(x + L + d * .6, y - th / 2 - d * .5); ctx.lineTo(x + L + d * .6, y + th / 2 - d * .5); ctx.lineTo(x + L, y + th / 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, y - th / 2, 0, y + th / 2, [[0, C[1]], [1, C[2]]]); ctx.fillRect(x, y - th / 2, L, th);
  ctx.restore();
  if (o.label) E.glowText(ctx, o.label, x - 22, y + 9, { size: o.size ?? 24, align: 'right', spacing: .08, glow: false, col: P.cream, a: a * rise(span(o.u ?? 1, 0, .4)) });
  if (o.value) E.glowText(ctx, o.value, x + L + d + 16, y + 10, { size: o.vsize ?? 28, serif: true, col: P.cream, glow: false, a: a * rise(span(o.u ?? 1, .6, 1)) });
}
export function slabBars(ctx, t, o) {
  o.rows.forEach((r, k) => slab(ctx, t, o.x, o.y + k * (o.pitch ?? 64), (o.w ?? 800) * r.v, o.th ?? 30, { col: r.col, label: r.label, value: r.value, u: span(o.u ?? 1, k * (o.stagger ?? .08), k * (o.stagger ?? .08) + .6), a: r.a ?? 1, size: o.size }));
}
// a thin bracket over a span with a label (the honest caveats: one calm line, never a red warning). u grows it from the middle
export function bracket(ctx, x0, x1, y, u, text, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const m = (x0 + x1) / 2, hw = (x1 - x0) / 2 * expoOut(u), col = o.col === 'check' ? CHECK.line : P.halo2;
  ctx.save(); ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(m - hw, y + 16); ctx.lineTo(m - hw, y); ctx.lineTo(m + hw, y); ctx.lineTo(m + hw, y + 16); ctx.stroke(); ctx.restore();
  if (text) maskLine(ctx, [[text, 0]], m, y - 18, o.size ?? 28, rise(span(u, .3, 1)), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
}
// a pinned label: a line from the anchor up-right, then TEXT / sub (wipe in from below). u 0..1
export function label(ctx, x, y, l1, l2, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const dx = o.dx ?? 50, dy = o.dy ?? -50, x1 = x + dx, y1 = y + dy;
  accentSpan(ctx, [[x, y], [x1, y1]], 0, smooth(clamp(u * 1.6)), { w: 1.6, spark: false, col: o.col ?? GOLD });
  maskLine(ctx, [[l1, 0]], x1 + (dx < 0 ? -measure(l1, o.size ?? 26, false) - 6 : 6), y1 - 10, o.size ?? 26, u, { serif: false, weight: 600, col: P.cream, glow: false });
  if (l2) maskLine(ctx, [[l2, 0]], x1 + (dx < 0 ? -measure(l2, (o.size ?? 26) * .72, false) - 6 : 6), y1 + 24, (o.size ?? 26) * .72, rise(span(u, .2, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
}
// a small source line (left, above the subtitles: y ≤ 880), rises and sinks
export function source(ctx, t, t0, t1, s, o = {}) {
  const u = rise(span(t, t0, t0 + .7)) * (1 - expoIn(span(t, t1 - .5, t1))); if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [[s.toUpperCase(), 0]], o.x ?? 110, o.y ?? 870, o.size ?? 19, u, { serif: false, weight: 600, col: P.halo2, glow: false, align: o.align }); ctx.restore();
}
// source lines (F.source), text-v2 Einblendungen; faktenzettel.md and vo-v3 override. The sender of every self-report stays on screen.
export const SOURCES = {
  flaw27: 'HIDDEN FOR 27 YEARS · OPENBSD · ANTHROPIC’S OWN ACCOUNT, APR 7, 2026',
  fermat: 'ANTHROPIC, SEP 4 / NOV 9, 2026 · ONE RUN EACH · THE SECOND STARTED WITH 47 LEMMAS FROM THE FIRST PROOF',
  buzzard: 'PROOF PUBLIC · REVIEWED BY KEVIN BUZZARD',
  unreleased: '“AN INTERNAL RESEARCH MODEL” · ANTHROPIC',   // vo-v4
  friar: 'OPENAI CFO SARAH FRIAR · CNBC, NOV 6, 2026',   // vo-v4: no R1 card any more, only this source line
  reproduce: 'MODEL STILL UNRELEASED · OPENAI, OCT 6, 2026',   // faktencheck must-change 10
  mythosPlan: '“WE DO NOT PLAN TO MAKE … GENERALLY AVAILABLE” · ANTHROPIC, APR 7, 2026',
  gov: 'UP TO 30 DAYS BEFORE RELEASE · VOLUNTARY · EO 14409',
  price5x: '5× OPUS 4.6 (LAUNCH PRICE, APR 7, 2026)',
  glasswing: 'PROJECT GLASSWING',
  confirmed: '129,000+ VERIFIED · APRIL–JULY · ANTHROPIC’S OWN COUNT',
  msRecord: 'KREBS ON SECURITY, TECHCRUNCH · MICROSOFT CITES AI IN GENERAL',
  blackHole: 'ANTHROPIC, NOV 9, 2026 · PREPRINTS, NOT PEER-REVIEWED · THE LAB’S OWN ACCOUNT',   // must-change 11
  threeSubs: '3 SUBSCRIPTIONS · 3 DAYS · ANTHROPIC, SEP 4, 2026',
  limit: '“LIMIT ADVANCES IN THE SPECIFIC RESEARCH CAPABILITIES THAT COULD MOST DIRECTLY ACCELERATE AI DEVELOPMENT”',
  rival: 'CAISI, SEP 17 · ANTHROPIC, SEP 29, 2026',
  astraHeld: 'WSJ, VIA CNBC, SEP 28, 2026 · GPT-6.1 ASTRA',
  testers: 'UK AISI, METR, FRONTIER DESIGN · ANTHROPIC, NOV 9, 2026',
  thousand: '1,000 COPIES · ONE RUN · STARTED WITH 47 LEMMAS FROM THE FIRST PROOF',
  priceDrop: 'ANTHROPIC, APR 7 / NOV 9, 2026',
};
// the thumbnail line: Inter 600 caps, cream with a soft glow, slightly condensed. u rises, o.out sinks (0..1). o.acc: [[line, word]] in gold
export function thesis(ctx, t, x, y, u, o = {}) {
  if (u <= 0) return;
  const size = o.size ?? 110, lines = o.lines ?? ['THE BEST AI', 'IS LOCKED'];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(.9, 1.08);
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .14, .78 + i * .14)) * (o.out != null ? 1 - expoIn(clamp(o.out * (1 + .12 * (lines.length - 1)) - i * .12)) : 1);
    if (ui > 0) maskLine(ctx, [[ln, 0]], o.align === 'right' ? 0 : 0, i * size * .98, size, ui, { serif: false, weight: 600, col: P.core0, glow: true, align: o.align });
  });
  ctx.restore();
}

// ======================================================================================================================== CAMERA PATH
// monotone cubic (Fritsch–Carlson) through camera keys [[t, cam]…] in x, y and log(F0 − z): C1-smooth, no overshoot, no stop between keys
// that keep moving the same way (a stop only where a key really reverses). Use E.camAt for dives ('i' / 'o').
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
