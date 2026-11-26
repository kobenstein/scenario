// Film 59 · "You Can Now Buy a Piece of AI" (thumbnail AI GOES PUBLIC) · shared kit (owned by the lead; builders import, never edit —
// wishes go in the report). Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText, the 2.5D card stage cam3/card/
// aim/camAt/camDrift, finish) + lib/f16_kit.mjs (rise, maskLine, measure, stamp) + a few generic blocks of lib/f54_kit.mjs (camPath,
// bracket, source). World: docs/MOTION.md §2. Shots: docs/shots.md. The city, the room and the seam plates: lib/f59_world.mjs.
//
//   THE CRYSTAL (the AI, the ONE hero light, thumbnail A): a huge golden faceted crystal of light over the night city. A facet breaks off
//   and falls into your hand: that is "a piece of AI" (the shard = a share). crystal() · shard().
//   THE WHEEL OF LIGHT (the say, thumbnail C): a ship's wheel of gold light behind glass in THE ROOM; never in your hand. wheel().
//   THE DINNER TABLE (the anchor): THE ROOM behind one lit window of a tower: a long table, 7 founders + 4 trustees (indigo silhouettes,
//   no faces) under the wheel's light. room() (drawn by the world inside the window; count lights the seats).
//   THE BELL (the opening bell, thumbnail B): hangs over the exchange at the right end of the city; its clapper is a small crystal.
//   It rings once, at "When the bell rings" (B3). bell().
//   THE COUNTDOWN BOARD (screen space, top left): COUNTDOWN TO THE BELL · STEP 1 THE PITCH → STEP 2 THE ORDERS ARE COUNTED → STEP 3
//   PRICING NIGHT → STEP 4 FIRST TRADE → +15 TRADING DAYS. Four stops on a rail that ends in a small bell glyph. NEVER a clock face.
//   It drives itself from BOARD phrases: board(ctx, t, T).
//   THE PROSPECTUS (the seller's own sales document): a thick stack of paper; warning tabs stick out; its pages lift out as cards.
//   EXPLAINERS (60–70 %): paper cards (warnings, quotes, letters), night cards with gold edge (data: KNOWN / FORECAST), the vote bar
//   (49.9 % | 50.1 %), lists, the jar (your savings), tags on gold threads, gold numbers. One statement per card, ≤ 6 words + 1 number.
//
// API (design px = screen px at the home camera; t in seconds; u = 0..1 growth):
//   colours: GOLD (the AI / crystal / the hero light; the wheel) · PAPER (documents, cards) · COOL (the market: prices, orders, tickers)
//            · INK (night forms) · LAMP (people's warm practical light, cream) · PRINT59 (finish) · bump(t, t0, d)
//   goldText(ctx, segs [[text, gold 0..1]…], x, y, size, u, o { serif, weight, align, spacing, col, glow })   (maskLine, gold words)
//   goldSpan(ctx, pts, u0, u1, o { w, a, spark })  a gold light line (thread) · goldLabel(ctx, x, y, l1, l2, u, o { dx, dy, size })
//   title(ctx, t, u, o { out, sub, subU })  THE THUMBNAIL TITLE: AI GOES / PUBLIC (Inter Black, condensed) + the small line under it
//   crystal(ctx, t, x, y, r, o { a, gap 0..1 (the broken facet is missing), glow, sheen, crack 0..1 }) → { gap: [x, y] (screen of the hole) }
//   shard(ctx, t, x, y, s, o { a, rot, glow, face 0..1 (its front face lights like a screen) })   the piece (a share)
//   wheel(ctx, t, x, y, r, o { a, glass 0..1 (a pane in front), spin, glow })   the wheel of light (the say)
//   bell(ctx, t, x, y, s, o { swing (rad), ring 0..1 (rings of light leave it), a })   the opening bell; (x, y) = top of the yoke
//   jar(ctx, t, x, y, s, o { fill 0..1, slice 0..1 (a small gold slice inside), a })   your savings (a glass jar with a lid; NOT a piggy bank)
//   prospectus(ctx, t, x, y, s, o { u, thick 0..1, tabs 0..1, open 0..1, cover, sub, page(ctx, w, h) (the open page), a }) → { x, y, w, h }
//   paperCard(ctx, t, x, y, w, h, o { u, rot, head, lines [[text, size, gold 0..1, serif]], src, style 'paper'|'night', a }) → box
//   dataCard(ctx, t, x, y, w, o { u, kind 'KNOWN'|'FORECAST'|'ESTIMATE'|'', title, big, small, src, a }) → box
//   quoteCard(ctx, t, T, o { text, x, y, w, size, credit, head, u, spoken [from, to] (words light with the VO), after, mode 'hi' (unspoken words
//            stand in full ink, the spoken ones turn gold as they are said; default: unspoken words wait faint) }) → box
//   voteBar(ctx, t, x, y, w, o { u, pub 0..1 (CLASS A fills to its cap), cap 0..1, fnd 0..1 (CLASS F), labels 0..1, n 0..1 (no-vote CLASS N) })
//   seats(ctx, t, x, y, s, o { f 0..1 (7 founders lit), tr 0..1 (4 trustees lit), a })  the 7 + 4 seats as an explainer row
//   room(ctx, t, w, h, o { lit, seated 0..1, wheel { a, glass }, count { f, tr } })   THE ROOM (window-local; used by the world)
//   appScreen(ctx, t, r { x, y, w, h }, o { … }) (c01: the banking app: rows, the new name ANT, tags, the price, BUY)
//   board(ctx, t, T, o { a, big 0..1 }) · BOARD · boardState(T, t)   the countdown to the bell (top left)
//   priceTag(ctx, t, x, y, text, u, o { size, swing, gold })   a paper tag on a gold thread (the warning label, the price tag)
//   veil(ctx, a)   the night veil over the world while a full-frame explainer speaks (screen space)
//   float(ctx, t, k)   screen-space explainers float a little (call inside save/restore)
//   camPath(t, K) (from f54) · bracket · source(ctx, t, t0, t1, text) · SOURCES
//   CLIP_RECT, CLIPS, clipWin, prepareClipFrames, clipPlate(ctx, t, T, id, o { from, morph, dark })   (ORIGINAL FOOTAGE · UN WEB TV)
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import * as F54 from './f54_kit.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, maskLine, measure, stamp } = K16;
export const { du, person, cam3, card, camAt, camDrift, aim, project, F0, glowText } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };
export const { bracket, source } = F54;
// camPath(t, K, ref = 6000): a camera that glides THROUGH its keys [[t, cam], …] (monotone cubic in x, y and log distance to the card
// at depth ref). Film 59 flies past the rooftop card (F0) into the city (Z 3800), so the reference is the crystal's depth, not F0.
export const REF = 6000;
export function camPath(t, K, ref = REF) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(ref - c.z)]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: ref - Math.exp(out[2]) });
}
const TAU = Math.PI * 2;
try { GlobalFonts.registerFromPath('/usr/share/fonts/opentype/inter/Inter-Black.otf', 'Inter Black'); } catch { /* falls back to Inter 600 */ }

export const PRINT59 = { grain: 14, floor: 4, vig: .5 };
// colour code (docs/MOTION.md §5): GOLD = the AI (the crystal, its shards, the wheel's light) — the one hero light, never on two things at once
// at full strength · PAPER = documents · COOL = the market (prices, orders) · LAMP = people's light · the yellow coat = only you
export const GOLD = { core: '#fff8dc', hot: '#ffe9a6', body: '#f6c95c', mid: '#e3a63f', shade: '#b8792a', deep: '#6e4416', halo: '#f2b632', line: '#ffd982', text: '#ffe7a8' };
export const PAPER = { body: '#ece4c8', lit: '#f7f0d8', shade: '#cfc4a2', edge: '#a99d7c', ink: '#141a3c', faint: '#8a8166' };
export const COOL = { core: '#f2f8ff', body: mixHex(P.cream, '#9fc2ee', .55), deep: mixHex(P.blue0, P.blue1, .5), line: mixHex(P.cream, '#9fc2ee', .4), halo: '#7fa6e6', text: mixHex(P.cream, '#9fc2ee', .35) };
export const INK = { far: mixHex(P.ind0, P.blue0, .3), mid: mixHex(P.night1, P.ind1, .6), near: P.night1, deep: P.night0, rim: mixHex(GOLD.line, P.blue1, .55) };
export const LAMP = { core: P.cream, body: mixHex(P.cream, P.halo2, .35), deep: mixHex(P.halo2, P.night1, .55) };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ======================================================================================================================== TEXT IN GOLD
export function goldText(ctx, segs, x, y, size, u, o = {}) {
  const serif = o.serif ?? true, k = expoOut(clamp(u)), dy = (1 - k) * size * 1.15;
  const mw = (txt) => measure(txt, size, serif, o.weight) + (o.spacing ? txt.length * size * o.spacing : 0);
  const total = segs.reduce((s, [txt]) => s + mw(txt), 0);
  let xx = o.align === 'center' ? x - total / 2 : o.align === 'right' ? x - total : x; const xs = [];
  ctx.save(); ctx.beginPath(); ctx.rect(xx - size, y - size * 1.25, total + size * 2, size * 1.25 + size * .32); ctx.clip();
  for (const [txt, m] of segs) {
    xs.push(xx);
    E.glowText(ctx, txt, xx, y + dy, { size, serif, col: mixHex(o.col ?? P.cream, GOLD.body, clamp(m)), weight: o.weight, glow: o.glow ?? false, spacing: o.spacing });
    xx += mw(txt);
  }
  ctx.restore();
  return { w: total, xs, x0: xs[0] };
}
export function goldSpan(ctx, pts, u0, u1, o = {}) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), i]; };
  const [sx, sy, i0] = at(u0 * L), [ex, ey, i1] = at(u1 * L), sub = [[sx, sy]];
  for (let i = i0; i < i1; i++) sub.push([pts[i][0], pts[i][1]]);
  sub.push([ex, ey]);
  const w = o.w ?? 3, a = o.a ?? 1;
  for (const [k, al, c, op] of [[4.5, .2, GOLD.halo, 'lighter'], [2.1, .8, GOLD.body, 'source-over'], [.9, 1, GOLD.core, 'source-over']]) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = c; ctx.globalAlpha = al * a; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
  }
  if (o.spark !== false && u1 < 1) halo(ctx, ex, ey, w * 10, .6 * a, GOLD.halo, GOLD.core);
  return [ex, ey];
}
export function goldLabel(ctx, x, y, l1, l2, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const dx = o.dx ?? 50, dy = o.dy ?? -50, x1 = x + dx, y1 = y + dy, sz = o.size ?? 26;
  goldSpan(ctx, [[x, y], [x1, y1]], 0, smooth(clamp(u * 1.6)), { w: 1.4, spark: false });
  const left = dx < 0;
  maskLine(ctx, [[l1, 0]], x1 + (left ? -measure(l1, sz, false) - 8 : 8), y1 - 10, sz, u, { serif: false, weight: 600, col: P.cream, glow: false });
  if (l2) maskLine(ctx, [[l2, 0]], x1 + (left ? -measure(l2, sz * .72, false) - 8 : 8), y1 + sz * .95, sz * .72, rise(span(u, .2, 1)), { serif: false, weight: 600, col: GOLD.text, glow: false });
}

// ======================================================================================================================== THE TITLE (frame 0)
// AI GOES / PUBLIC like thumbnail A: heavy condensed caps, cream with a warm glow, left; the small line under it. u rises, o.out sinks.
export function title(ctx, t, u, o = {}) {
  if (u <= 0) return;
  const x = o.x ?? 72, y = o.y ?? 470, lines = o.lines ?? ['AI GOES', 'PUBLIC'], cond = o.cond ?? .7;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `100px "Inter Black"`; const wide = Math.max(...lines.map((l) => ctx.measureText(l).width)) * cond / 100;
  const size = Math.min(o.size ?? 420, (o.maxW ?? 940) / wide);
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .14, .78 + i * .14)), ex = o.out != null ? sineIO(clamp(o.out * 1.15 - i * .12)) : 0; if (ui <= 0 || ex >= 1) return;
    const k = expoOut(ui), yy = y + i * size * .86 + (1 - k) * size * .5 + ex * size * .95;   // exit: an even sink behind the line's mask
    ctx.save(); ctx.beginPath(); ctx.rect(x - 40, y + i * size * .86 - size * .82, W, size * .9); ctx.clip();
    ctx.translate(x, yy); ctx.scale(cond, 1);
    ctx.font = `${size}px "Inter Black"`; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = '-0.01em';
    ctx.shadowColor = rgba(GOLD.halo, .75); ctx.shadowBlur = size * .16; ctx.fillStyle = '#fff6d8'; ctx.fillText(ln, 0, 0);
    ctx.shadowBlur = 0; ctx.fillStyle = '#fffbea'; ctx.fillText(ln, 0, 0);
    ctx.restore();
  });
  if (o.sub) {
    const su = (o.subU ?? rise(span(u, .5, 1))) * (o.out != null ? 1 - expoIn(clamp(o.out * 1.3 - .25)) : 1);
    if (su > 0) goldText(ctx, [[o.sub, .55]], x + 8, o.subY ?? Math.min(872, y + size * .86 * (lines.length - 1) + size * .3), o.subSize ?? 26, su, { serif: false, weight: 600, spacing: .1 });
  }
  ctx.restore();
}

// ======================================================================================================================== THE CRYSTAL
// Normalised geometry from thumbnail A (radius 1, centre 0,0): outer silhouette o0…o6, inner points i0…i3; facets as triangles with a
// fixed light value (light from the top left). GAP = the bottom facet that breaks off (the shard).
const CO = [[-.76, -.52], [.05, -.9], [.98, -.38], [.93, .57], [.48, .9], [-.14, .8], [-1, 0]];
const CI = [[-.15, -.38], [.45, .03], [-.32, .33], [.2, .55]];
const PT = (k) => (k < 7 ? CO[k] : CI[k - 7]);
// [a, b, c, light]  indices: 0–6 outer, 7–10 inner
const FACETS = [[0, 1, 7, .98], [1, 2, 8, .8], [1, 8, 7, .92], [6, 0, 7, .74], [6, 7, 9, .62], [7, 8, 9, .86], [2, 3, 8, .58], [3, 10, 8, .5], [3, 4, 10, .42], [8, 10, 9, .7], [5, 6, 9, .46], [5, 9, 10, .56]];
export const GAP = [4, 5, 10];   // the facet that falls (bottom middle)
const shadeOf = (l) => (l > .85 ? mixHex(GOLD.hot, GOLD.core, (l - .85) / .15) : l > .6 ? mixHex(GOLD.body, GOLD.hot, (l - .6) / .25) : l > .45 ? mixHex(GOLD.mid, GOLD.body, (l - .45) / .15) : mixHex(GOLD.shade, GOLD.mid, (l - .3) / .15));
export function crystal(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const gap = clamp(o.gap ?? 0), br = 1 + .012 * Math.sin(t * .8), R = r * br, rot = (o.rot ?? 0) + .015 * Math.sin(t * .23);
  const cs = Math.cos(rot), sn = Math.sin(rot), p = (k) => { const [u, v] = PT(k); return [x + (u * cs - v * sn) * R, y + (u * sn + v * cs) * R]; };
  ctx.save(); ctx.globalAlpha *= a;
  // the light around it (blue-gold bloom), stipple dust comes from the finish grain
  halo(ctx, x, y, R * 2.3 * (o.glow ?? 1), .22 * (o.glow ?? 1), GOLD.halo, GOLD.hot);
  halo(ctx, x - R * .1, y - R * .2, R * 1.25, .35 * (o.glow ?? 1), GOLD.body, GOLD.core);
  const sheen = o.sheen ?? .5 + .5 * Math.sin(t * .31);
  for (const [i, j, k, l] of FACETS) {
    const A = p(i), B = p(j), Cc = p(k), cx = (A[0] + B[0] + Cc[0]) / 3, cy = (A[1] + B[1] + Cc[1]) / 3;
    const lv = clamp(l + .06 * Math.sin(t * .4 + cx * .004 + cy * .003) + .05 * sheen * (1 - Math.abs((cx - x) / R + .3)));
    ctx.fillStyle = lin(ctx, A[0], A[1], (B[0] + Cc[0]) / 2, (B[1] + Cc[1]) / 2, [[0, shadeOf(clamp(lv + .07))], [1, shadeOf(clamp(lv - .06))]]);
    ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...Cc); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(GOLD.core, .22); ctx.lineWidth = Math.max(1, R * .006); ctx.stroke();
  }
  // the gap facet: whole (gap 0) → a dark hole with a hot rim (gap 1)
  const [A, B, Cc] = GAP.map(p);
  ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...Cc); ctx.closePath();
  ctx.fillStyle = mixHex(shadeOf(.52), mixHex(P.night1, GOLD.deep, .35), gap); ctx.fill();
  if (gap > 0) { ctx.strokeStyle = rgba(GOLD.core, .85 * gap); ctx.lineWidth = Math.max(1.5, R * .012); ctx.stroke(); }
  if (o.crack > 0) {   // a hairline along the gap's edges before it breaks (anticipation)
    ctx.strokeStyle = rgba(GOLD.core, .9 * o.crack); ctx.lineWidth = Math.max(1, R * .008); ctx.stroke();
  }
  ctx.restore();
  return { gap: [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3], r: R };
}
// the shard (a share): a small faceted triangle; (x, y) = its centre, s = its size (≈ width). o.face lights its front like a screen.
export function shard(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(s, s);
  if (o.glow !== 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.restore(); halo(ctx, 0, 0, 1.6, .45 * (o.glow ?? 1), GOLD.halo, GOLD.core); }
  const T0 = [-.5, -.42], T1 = [.55, -.36], B0 = [.04, .62], M = [.02, -.39];
  ctx.fillStyle = lin(ctx, -.5, -.4, .3, .6, [[0, GOLD.hot], [1, GOLD.body]]); ctx.beginPath(); ctx.moveTo(...T0); ctx.lineTo(...M); ctx.lineTo(...B0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -.4, .5, .5, [[0, GOLD.body], [1, GOLD.mid]]); ctx.beginPath(); ctx.moveTo(...M); ctx.lineTo(...T1); ctx.lineTo(...B0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(GOLD.core, .85); ctx.beginPath(); ctx.moveTo(...T0); ctx.lineTo(...T1); ctx.lineTo(.5, -.3); ctx.lineTo(-.44, -.36); ctx.closePath(); ctx.fill();
  if (o.face > 0) { ctx.fillStyle = rgba(GOLD.core, .6 * o.face); ctx.beginPath(); ctx.moveTo(...T0); ctx.lineTo(...T1); ctx.lineTo(...B0); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}

// ======================================================================================================================== THE WHEEL OF LIGHT
export function wheel(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= 0) return;
  const rot = (o.spin ?? 0) + .03 * Math.sin(t * .27);
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, r * 2.1, .3 * (o.glow ?? 1), GOLD.halo, GOLD.hot);
  ctx.translate(x, y); ctx.rotate(rot);
  const body = mixHex(GOLD.body, GOLD.hot, .35);
  ctx.lineCap = 'round';
  for (let k = 0; k < 8; k++) {   // spokes with handles beyond the rim
    const an = k / 8 * TAU, c = Math.cos(an), s = Math.sin(an);
    ctx.strokeStyle = body; ctx.lineWidth = r * .1; ctx.beginPath(); ctx.moveTo(c * r * .22, s * r * .22); ctx.lineTo(c * r * 1.12, s * r * 1.12); ctx.stroke();
    ctx.lineWidth = r * .15; ctx.beginPath(); ctx.moveTo(c * r * 1.12, s * r * 1.12); ctx.lineTo(c * r * 1.3, s * r * 1.3); ctx.stroke();
    ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(c * r * 1.33, s * r * 1.33, r * .1, 0, TAU); ctx.fill();
  }
  ctx.strokeStyle = body; ctx.lineWidth = r * .16; ctx.beginPath(); ctx.arc(0, 0, r * .9, 0, TAU); ctx.stroke();
  ctx.strokeStyle = rgba(GOLD.core, .7); ctx.lineWidth = r * .04; ctx.beginPath(); ctx.arc(0, 0, r * .9, Math.PI * 1.05, Math.PI * 1.7); ctx.stroke();
  ctx.fillStyle = rad(ctx, 0, 0, r * .3, [[0, GOLD.core], [.6, GOLD.hot], [1, GOLD.body]]); ctx.beginPath(); ctx.arc(0, 0, r * .28, 0, TAU); ctx.fill();
  ctx.restore();
  const g = clamp(o.glass ?? 0);
  if (g > 0) {   // the pane in front: a cool-blue sheet with two diagonal reflections and a thin frame (slides in from the right)
    const w = r * 3.2, h = r * 3.2, gx = x - w / 2 + (1 - sineIO(g)) * w * .9, gy = y - h / 2;
    ctx.save(); ctx.globalAlpha *= a * sineIO(g) * .95 + .05;
    ctx.fillStyle = rgba(mixHex(P.blue1, P.night1, .4), .32); ctx.fillRect(gx, gy, w, h);
    ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = Math.max(1.5, r * .025); ctx.strokeRect(gx, gy, w, h);
    ctx.beginPath(); ctx.rect(gx, gy, w, h); ctx.clip();
    ctx.fillStyle = rgba(P.cream, .12);
    for (const [o0, ww] of [[.15, .1], [.32, .04]]) { ctx.beginPath(); ctx.moveTo(gx + w * o0, gy); ctx.lineTo(gx + w * (o0 + ww), gy); ctx.lineTo(gx + w * (o0 + ww - .3), gy + h); ctx.lineTo(gx + w * (o0 - .3), gy + h); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
}

// ======================================================================================================================== THE BELL
// (x, y) = the pivot under the yoke; s = bell height. swing = angle; ring 0..1 = rings of gold light leave the mouth (one strike).
export function bell(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = mixHex(P.night1, P.blue2, .35); ctx.fillRect(-s * .32, -s * .16, s * .64, s * .14);   // the yoke
  ctx.rotate(o.swing ?? 0);
  const p = new Path2D(); p.moveTo(-s * .2, 0); p.bezierCurveTo(-s * .25, s * .1, -s * .26, s * .45, -s * .34, s * .72); p.quadraticCurveTo(-s * .52, s * .92, -s * .56, s * .98);
  p.lineTo(s * .56, s * .98); p.quadraticCurveTo(s * .52, s * .92, s * .34, s * .72); p.bezierCurveTo(s * .26, s * .45, s * .25, s * .1, s * .2, 0); p.closePath();
  ctx.fillStyle = lin(ctx, -s * .5, 0, s * .5, s, [[0, mixHex(GOLD.deep, P.blue1, .5)], [.45, mixHex(GOLD.mid, P.blue1, .45)], [1, mixHex(GOLD.deep, P.night1, .5)]]); ctx.fill(p);
  ctx.strokeStyle = rgba(GOLD.line, .45); ctx.lineWidth = s * .012; ctx.stroke(p);
  ctx.fillStyle = mixHex(GOLD.body, P.blue1, .35); ctx.beginPath(); ctx.ellipse(0, s * .98, s * .56, s * .07, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = rad(ctx, 0, s * .98, s * .5, [[0, GOLD.hot], [1, GOLD.mid]]); ctx.beginPath(); ctx.ellipse(0, s * .985, s * .5, s * .05, 0, 0, TAU); ctx.fill();
  // the clapper: a small crystal on a rod (swings a little against the bell)
  const cl = (o.clapper ?? 0) + .04 * Math.sin(t * .9);
  ctx.save(); ctx.translate(0, s * .2); ctx.rotate(cl); ctx.strokeStyle = mixHex(GOLD.deep, P.night1, .3); ctx.lineWidth = s * .025; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, s * .66); ctx.stroke();
  crystal(ctx, t, 0, s * .8, s * .12, { glow: .7 + (o.ring ?? 0) }); ctx.restore();
  ctx.restore();
  const rg = o.ring ?? 0;
  if (rg > 0 && rg < 1) {   // three rings of light leave the mouth and widen over the city
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 3; k++) { const u = clamp(rg * 1.4 - k * .2); if (u <= 0 || u >= 1) continue; ctx.strokeStyle = rgba(GOLD.line, .55 * (1 - u)); ctx.lineWidth = s * .03 * (1 - u * .6);
      ctx.beginPath(); ctx.ellipse(x, y + s * .95, s * (.6 + u * 3.4), s * (.12 + u * 1.1), 0, 0, TAU); ctx.stroke(); }
    ctx.restore();
  }
}

// ======================================================================================================================== THE JAR (your savings)
export function jar(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);   // (x, y) = bottom centre; s = height
  const w = s * .62, body = new Path2D(); body.roundRect(-w / 2, -s * .86, w, s * .86, s * .1);
  ctx.fillStyle = rgba(mixHex(P.blue1, P.night1, .5), .55); ctx.fill(body);
  const f = clamp(o.fill ?? .35);
  ctx.save(); ctx.clip(body);
  ctx.fillStyle = lin(ctx, 0, -s * .86 * f, 0, 0, [[0, mixHex(LAMP.body, P.blue1, .45)], [1, mixHex(LAMP.deep, P.night1, .4)]]); ctx.fillRect(-w / 2, -s * .86 * f, w, s * .86 * f);
  for (let k = 0; k < 6; k++) { ctx.fillStyle = rgba(P.cream, .12); ctx.fillRect(-w / 2 + w * (.1 + k * .14), -s * .86 * f + 4, w * .1, s * .86 * f); }   // coins/papers as faint stripes
  ctx.restore();
  if (o.slice > 0) shard(ctx, t, 0, -s * .86 * f - s * .06 * (1 - o.slice), s * .18, { a: clamp(o.slice * 2), glow: .6 });
  ctx.strokeStyle = rgba(P.cream, .6); ctx.lineWidth = Math.max(1.5, s * .016); ctx.stroke(body);
  ctx.fillStyle = mixHex(P.blue2, P.night1, .2); ctx.beginPath(); ctx.roundRect(-w * .44, -s * .96, w * .88, s * .1, s * .03); ctx.fill();
  ctx.fillStyle = rgba(P.cream, .16); ctx.fillRect(-w * .36, -s * .78, w * .07, s * .6);
  ctx.restore();
}

// ======================================================================================================================== PAPER
// the prospectus: a thick stack (thick 0..1), a cover with a title, warning tabs on the right edge (tabs 0..1), open 0..1 → a page spread
// that the caller draws with o.page(ctx, w, h) (local, top-left of the right page). (x, y) = top-left of the cover, s = width.
export function prospectus(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const a = o.a ?? 1, h = s * 1.3, th = s * .16 * clamp(o.thick ?? 1), op = sineIO(clamp(o.open ?? 0));
  ctx.save(); ctx.globalAlpha *= a * rise(u); ctx.translate(x, y + (1 - expoOut(u)) * 60);
  // the stack's thickness (page edges)
  for (let k = 0; k < 14; k++) { const yy = h + th * (k / 13); ctx.fillStyle = k % 2 ? PAPER.shade : PAPER.edge; ctx.fillRect(th * .25 * (k / 13), yy - 2, s - 2, 3); }
  ctx.fillStyle = PAPER.edge; ctx.fillRect(s, th * .25, th * .25, h);
  // warning tabs (cream-gold slips) out of the right edge
  const tb = clamp(o.tabs ?? 0);
  if (tb > 0) for (let k = 0; k < 18; k++) { const v = clamp(tb * 1.6 - k * .035); if (v <= 0) continue; const yy = h * .06 + k * h * .052, len = s * .07 * expoOut(v);
    ctx.fillStyle = k % 3 === 1 ? GOLD.body : mixHex(PAPER.lit, GOLD.hot, .35); ctx.fillRect(s - 2, yy, len, h * .03); }
  // the cover (or the open spread)
  if (op < 1) {
    ctx.save(); ctx.translate(0, 0); ctx.scale(1 - op, 1);
    ctx.fillStyle = lin(ctx, 0, 0, s, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(0, 0, s, h);
    ctx.strokeStyle = rgba(PAPER.ink, .25); ctx.lineWidth = 2; ctx.strokeRect(s * .06, s * .06, s * .88, h - s * .12);
    E.glowText(ctx, o.cover ?? 'PROSPECTUS', s / 2, h * .3, { size: s * .1, weight: 600, align: 'center', spacing: .12, col: PAPER.ink, glow: false });
    if (o.sub !== '') E.glowText(ctx, o.sub ?? 'FORM S-1', s / 2, h * .3 + s * .1, { size: s * .045, weight: 600, align: 'center', spacing: .2, col: PAPER.faint, glow: false });
    for (let k = 0; k < 7; k++) { ctx.fillStyle = rgba(PAPER.ink, .12); ctx.fillRect(s * .16, h * .52 + k * h * .05, s * (k % 3 === 2 ? .45 : .68), h * .012); }
    ctx.restore();
  }
  if (op > 0) {   // the open spread: left page grows to the left, right page is the caller's
    const lw = s * op;
    ctx.fillStyle = lin(ctx, -lw, 0, 0, 0, [[0, PAPER.body], [1, PAPER.shade]]); ctx.fillRect(-lw, 0, lw, h);
    for (let k = 0; k < 12; k++) { ctx.fillStyle = rgba(PAPER.ink, .1 * op); ctx.fillRect(-lw + lw * .12, h * .1 + k * h * .066, lw * (k % 4 === 3 ? .4 : .76), h * .011); }
    ctx.fillStyle = lin(ctx, 0, 0, s, 0, [[0, PAPER.shade], [.06, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(0, 0, s, h);
    if (o.page) { ctx.save(); ctx.globalAlpha *= span(op, .5, 1); o.page(ctx, s, h); ctx.restore(); }
  }
  ctx.restore();
  return { x: x - s * op, y, w: s * (1 + op), h };
}
// a card: 'paper' (cream, dark ink: warnings, letters, quotes) or 'night' (dark indigo, gold edge: data). lines [[text, size, gold, serif]]
export function paperCard(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const night = o.style === 'night', k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3);
  ctx.translate(x + w / 2, y + h / 2 + (1 - k) * 40); ctx.rotate((o.rot ?? 0) + (1 - k) * .04); ctx.translate(-w / 2, -h / 2);
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(6, 10, w, h, 10); ctx.fill();
  ctx.fillStyle = night ? mixHex(P.night1, P.ind2, .55) : lin(ctx, 0, 0, w, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, w, h, night ? 12 : 6); ctx.fill();
  ctx.strokeStyle = night ? rgba(GOLD.line, .55) : rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  let yy = 0;
  if (o.head) { const hs = o.headSize ?? 20; maskLine(ctx, [[o.head, 0]], 34, 50, hs, rise(span(u, .2, .8)), { serif: false, weight: 600, col: night ? GOLD.text : PAPER.faint, glow: false }); yy = 50 + hs * .6; }
  else yy = 20;
  for (const [i, ln] of (o.lines ?? []).entries()) {
    const [txt, size, g = 0, serif = true] = ln; yy += size * 1.18;
    const col = night ? mixHex(P.cream, GOLD.body, g) : mixHex(PAPER.ink, GOLD.deep, g);
    maskLine(ctx, [[txt, 0]], 34, yy, size, rise(span(u, .3 + i * .08, .9 + i * .08)), { serif, weight: 600, col, glow: false });
  }
  if (o.src) maskLine(ctx, [[o.src.toUpperCase(), 0]], 34, h - 24, 15, rise(span(u, .5, 1)), { serif: false, weight: 600, col: night ? P.halo2 : PAPER.faint, glow: false });
  ctx.restore();
  return { x, y, w, h };
}
// a data card (night style, gold edge) with a kind tag (KNOWN / FORECAST / ESTIMATE), a big gold number and one small line
export function dataCard(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const h = o.h ?? (o.small ? 300 : 250);
  const box = paperCard(ctx, t, x, y, w, h, { u, style: 'night', a: o.a, rot: o.rot });
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y + (1 - expoOut(u)) * 40);
  if (o.kind) {
    const kc = o.kind === 'KNOWN' ? GOLD.body : o.kind === 'FORECAST' ? COOL.body : PAPER.shade, tw = measure(o.kind, 17, false, 600) + 17 * o.kind.length * .14 + 30;
    ctx.fillStyle = rgba(kc, .16); ctx.strokeStyle = rgba(kc, .9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(30, 26, tw, 34, 17); ctx.fill(); ctx.stroke();
    E.glowText(ctx, o.kind, 30 + 15, 49, { size: 17, weight: 600, spacing: .14, col: kc, glow: false });
  }
  if (o.title) maskLine(ctx, [[o.title, 0]], 34, 102, 22, rise(span(u, .25, .8)), { serif: false, weight: 600, col: P.halo2, glow: false });
  if (o.big) goldText(ctx, [[o.big, 1]], 32, o.title ? 186 : 160, o.bigSize ?? 76, rise(span(u, .35, 1)), { serif: true });
  if (o.small) maskLine(ctx, [[o.small, 0]], 34, o.title ? 236 : 210, 21, rise(span(u, .5, 1)), { serif: false, weight: 600, col: P.cream, glow: false });
  if (o.src) maskLine(ctx, [[o.src.toUpperCase(), 0]], 34, h - 22, 15, rise(span(u, .55, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
  return box;
}
// a quote card (paper): head (e.g. RISK FACTORS), the quote in serif (wrapped to w), words light gold-ink as they are spoken (o.spoken =
// [fromPhrase, toPhrase] in the VO), else they stand dark ink; credit line at the bottom. Returns the box.
const nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export function quoteCard(ctx, t, T, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const size = o.size ?? 54, w = o.w ?? 1100, pad = 54, words = o.text.split(/\s+/), lines = []; let cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && measure(nx.join(' '), size, true) > w - pad * 2) { lines.push(cur); cur = [wd]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const head = o.head ? 64 : 24, h = head + lines.length * size * 1.22 + (o.credit ? 92 : 40);
  // spoken timing: map card words to VO words in order
  let times = null;
  if (o.spoken && T) { try { const ws = T.GW(o.spoken[0], o.spoken[1], o.after ?? -1); times = []; let j = 0; for (const wd of lines.flat()) { const n = nz(wd); let hit = null; for (let q = j; q < ws.length; q++) if (nz(ws[q].w) === n && n) { hit = ws[q].s; j = q + 1; break; } times.push(hit); } } catch { times = null; } }
  const x = o.x ?? (W - w) / 2, y = o.y ?? 200;
  const box = paperCard(ctx, t, x, y, w, h, { u, rot: o.rot ?? -.006, head: o.head, a: o.a });
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y + (1 - expoOut(u)) * 40);
  let k = 0;
  lines.forEach((ln, li) => {
    let xx = pad; const yy = head + (li + 1) * size * 1.22;
    for (const wd of ln) {
      const tt = times ? times[k] : null, hiMode = o.mode === 'hi', lit = tt == null ? (times && !hiMode ? .25 : 1) : clamp((t - tt + .05) / .25), g = (o.gold ?? 1) * (times && tt != null ? lit : 0);
      const col = mixHex(mixHex(PAPER.faint, PAPER.ink, times && !hiMode ? lit : (hiMode && tt != null ? 1 : times ? lit : 1)), GOLD.deep, g * .85);
      maskLine(ctx, [[wd + ' ', 0]], xx, yy, size, rise(span(u, .3 + li * .08, .9 + li * .08)), { serif: true, col, glow: false });
      xx += measure(wd + ' ', size, true); k++;
    }
  });
  if (o.credit) maskLine(ctx, [[o.credit.toUpperCase(), 0]], pad, h - 34, 18, rise(span(u, .55, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  ctx.restore();
  return { ...box, h };
}

// ======================================================================================================================== THE VOTE
// the vote bar: one long bar = 100 % of the votes. CLASS A (the public's shares, cool) fills from the left up to its CAP at 49.9 %;
// CLASS F (the seven founders, gold) holds the right 50.1 % fixed. Labels below. n: a third row CLASS N (Amazon, Google: no vote).
export function voteBar(ctx, t, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const h = o.h ?? 64, cap = .499, frame = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3);
  ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, w * frame, h, 10); ctx.stroke();
  const pub = clamp(o.pub ?? 0) * cap, f = clamp(o.fnd ?? 0);
  if (pub > 0) { ctx.fillStyle = lin(ctx, x, y, x + w * pub, y, [[0, mixHex(COOL.deep, COOL.body, .3)], [1, COOL.body]]); ctx.beginPath(); ctx.roundRect(x + 3, y + 3, Math.max(0, w * pub - 6), h - 6, 8); ctx.fill(); }
  if (f > 0) { const fw = w * (1 - cap) * expoOut(f); ctx.fillStyle = lin(ctx, x + w - fw, y, x + w, y, [[0, GOLD.mid], [1, GOLD.hot]]); ctx.beginPath(); ctx.roundRect(x + w - fw + 3, y + 3, Math.max(0, fw - 6), h - 6, 8); ctx.fill(); }
  const cp = clamp(o.cap ?? 0);
  if (cp > 0) { const cx = x + w * cap; ctx.strokeStyle = rgba(P.cream, .9 * cp); ctx.lineWidth = 3; ctx.setLineDash([8, 7]); ctx.beginPath(); ctx.moveTo(cx, y - 34 * cp); ctx.lineTo(cx, y + h + 34 * cp); ctx.stroke(); ctx.setLineDash([]); }
  const lb = clamp(o.labels ?? 0);
  if (lb > 0) {
    maskLine(ctx, [['ALL CLASS A SHARES, OLD AND NEW', 0]], x, y + h + 46, 22, rise(lb), { serif: false, weight: 600, col: COOL.text, glow: false });
    goldText(ctx, [['MAX 49.9 %', 0]], x, y + h + 112, 60, rise(span(lb, .1, 1)), { serif: true, col: COOL.text });
    maskLine(ctx, [['FOUNDERS (CLASS F)', 0]], x + w, y + h + 46, 22, rise(span(o.fndLab ?? lb, 0, 1) * (f > 0 ? 1 : 0)), { serif: false, weight: 600, col: GOLD.text, glow: false, align: 'right' });
    if (f > 0) goldText(ctx, [['FIXED 50.1 %', 1]], x + w, y + h + 112, 60, rise(span(f, .3, 1)), { serif: true, align: 'right' });
  }
  ctx.restore();
}
// the 7 + 4 seats as an explainer row: seven founders' chairs (gold rim when lit), a gap, four trustees' chairs (cream rim when lit)
export function seats(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < 11; k++) {
    const fnd = k < 7, lit = fnd ? clamp((o.f ?? 0) * 7 - k) : clamp((o.tr ?? 0) * 4 - (k - 7)), xx = x + k * s * 1.25 + (fnd ? 0 : s * .9);
    const rim = fnd ? GOLD.body : LAMP.body;
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.beginPath(); ctx.roundRect(xx, y - s, s, s * .62, s * .14); ctx.fill();   // back
    ctx.fillRect(xx, y - s * .4, s, s * .14); ctx.fillRect(xx + s * .06, y - s * .3, s * .1, s * .3); ctx.fillRect(xx + s * .84, y - s * .3, s * .1, s * .3);
    if (lit > 0) { ctx.strokeStyle = rgba(rim, .9 * lit); ctx.lineWidth = Math.max(2, s * .05); ctx.beginPath(); ctx.roundRect(xx, y - s, s, s * .62, s * .14); ctx.stroke(); halo(ctx, xx + s / 2, y - s * .7, s * .9, .25 * lit, fnd ? GOLD.halo : LAMP.body, P.cream); }
  }
  ctx.restore();
}

// ======================================================================================================================== THE ROOM
// THE ROOM behind the tower window (window-local: w × h, origin top left). The wheel of light high on the back wall behind a glass
// partition; a long table under it; 7 founders behind the table (facing us), 2 trustees at each end (in profile). Faceless silhouettes.
// o { lit 0..1, seated 0..1 (they fade from the dark as the light comes up), wheel { a, glass }, count { f 0..1, tr 0..1 } (rims light) }
export function room(ctx, t, w, h, o = {}) {
  const lit = clamp(o.lit ?? 1), wa = o.wheel?.a ?? 1;
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.night0, P.ind1, .4)], [.6, mixHex(P.ind2, GOLD.deep, .4 * lit)], [1, P.night0]]); ctx.fillRect(0, 0, w, h);
  const wx = w * .5, wy = h * .27, wr = h * .12;
  halo(ctx, wx, wy, h * .9, .22 * lit * wa, GOLD.halo, GOLD.hot);
  // the back wall panels
  ctx.fillStyle = rgba(P.night0, .25); for (let k = 0; k < 6; k++) ctx.fillRect(w * (.05 + k * .16), h * .08, w * .02, h * .55);
  wheel(ctx, t, wx, wy, wr, { a: wa * (.4 + .6 * lit), glass: o.wheel?.glass ?? 1, glow: .7 });
  // the table (front edge + top), the light pool on it
  const ty = h * .7, tx0 = w * .14, tx1 = w * .86;
  const cnt = o.count ?? {};
  // a faceless bust (head + shoulders), indigo, warm rim on the top edge from the wheel's light; dir 0 = facing us, ±1 = in profile
  const sit = (x, y, sz, dir, k, fnd) => {
    const lt = fnd ? clamp((cnt.f ?? 0) * 7 - k) : clamp((cnt.tr ?? 0) * 4 - k), br = .006 * Math.sin(t * .9 + k * 1.7);
    ctx.save(); ctx.globalAlpha *= clamp(o.seated ?? 1); ctx.translate(x, y); ctx.scale(sz, sz * (1 + br));
    const p = new Path2D(), hx = dir ? dir * .03 : .006 * Math.sin(t * .3 + k);
    p.moveTo(-.27, 0); p.bezierCurveTo(-.27, -.2, -.2, -.3, -.07, -.32); p.lineTo(.07, -.32); p.bezierCurveTo(.2, -.3, .27, -.2, .27, 0); p.closePath();
    p.moveTo(hx + .12, -.47); p.arc(hx, -.47, .12, 0, TAU);
    const rim = mixHex(mixHex(P.blue1, GOLD.mid, .5 * lit), fnd ? GOLD.hot : LAMP.core, lt);
    ctx.fillStyle = rim; ctx.translate(0, -.018); ctx.fill(p); ctx.translate(0, .018);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fill(p);
    ctx.restore();
    if (lt > 0) halo(ctx, x, y - sz * .5, sz * .45, .3 * lt, fnd ? GOLD.halo : LAMP.body, P.cream);
  };
  for (let k = 0; k < 7; k++) sit(lerp(tx0 + w * .08, tx1 - w * .08, k / 6), ty - h * .02, h * .3, 0, k, true);
  ctx.fillStyle = lin(ctx, 0, ty - h * .05, 0, ty + h * .03, [[0, mixHex(P.blue1, GOLD.mid, .55 * lit)], [1, mixHex(P.blue2, P.night1, .5)]]);
  ctx.beginPath(); ctx.moveTo(tx0 + w * .03, ty - h * .05); ctx.lineTo(tx1 - w * .03, ty - h * .05); ctx.lineTo(tx1, ty + h * .03); ctx.lineTo(tx0, ty + h * .03); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(tx0, ty + h * .03, tx1 - tx0, h * .05);
  ctx.fillRect(tx0 + w * .02, ty + h * .08, w * .015, h * .16); ctx.fillRect(tx1 - w * .035, ty + h * .08, w * .015, h * .16);
  for (const [k, side] of [[0, -1], [1, -1], [2, 1], [3, 1]]) {   // the four trustees at the ends, in profile, facing the table
    const ex = side < 0 ? tx0 - w * (.01 + (k % 2) * .075) : tx1 + w * (.01 + (k % 2) * .075);
    sit(ex, ty + h * .05 + (k % 2) * h * .03, h * .3, side < 0 ? 1 : -1, k, false);
  }
  ctx.fillStyle = lin(ctx, 0, h * .85, 0, h, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .7)]]); ctx.fillRect(0, h * .85, w, h * .15);
}

// ======================================================================================================================== THE BANKING APP (c01)
// The phone screen as a screen-space panel r { x, y, w, h }. o: { rows 0..1 (the known names), ant 0..1 (the new row slides in at the top),
// letters [a, n, t] 0..1, kinds [[text, u, [row, …]]…] (a cool label on known rows, e.g. CHIP MAKER), diff 0..1 (the known rows dim, the
// new row gets a gold edge: "this is different"), tags [[text, u, strike 0..1, gold 0..1]…] (under the new row), tap 0..1 (ripple), detail 0..1 (the ANT page), price 0..1, buy 0..1,
// press 0..1, q 0..1 (a ? over the button), a }
export function appScreen(ctx, t, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const { x, y, w, h } = r, rr = Math.min(48, w * .08);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.beginPath(); ctx.roundRect(x, y, w, h, rr); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .7); ctx.lineWidth = 3; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, rr); ctx.clip();
  const k = w / 600, pad = 44 * k, dt = sineIO(clamp(o.detail ?? 0)), lx = x - dt * w;
  // --- the list
  const rowH = 96 * k, top = y + 150 * k, antU = expoOut(clamp(o.ant ?? 0));
  maskLine(ctx, [['MY STOCKS', 0]], lx + pad, y + 96 * k, 26 * k, rise(clamp(o.rows ?? 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  const tagSpace = (o.tags ?? []).reduce((m, tg, i) => Math.max(m, expoOut(clamp(tg[1])) * (i + 1)), 0) * 66 * k + (o.tags?.length ? 24 * k * expoOut(clamp(o.tags[0][1])) : 0);
  for (let i = 0; i < 6; i++) {
    const ry = top + (i + antU) * rowH + tagSpace, ru = clamp((o.rows ?? 1) * 6 - i); if (ru <= 0 || ry > y + h) continue;
    ctx.globalAlpha = a * ru * .9;
    ctx.fillStyle = rgba(P.blue1, .9); ctx.beginPath(); ctx.arc(lx + pad + 26 * k, ry + rowH / 2, 24 * k, 0, TAU); ctx.fill();
    const kd = (o.kinds ?? []).find((q) => q[2].includes(i)), ku = kd ? clamp(kd[1]) : 0;
    ctx.globalAlpha = a * ru * .9 * (1 - .55 * sineIO(clamp(o.diff ?? 0)));
    ctx.fillStyle = rgba(P.cream, .5 * (1 - .7 * ku)); ctx.fillRect(lx + pad + 70 * k, ry + rowH * .36, (120 + (i * 37) % 90) * k, 14 * k);
    ctx.fillStyle = rgba(P.halo2, .25 * (1 - .7 * ku)); ctx.fillRect(lx + pad + 70 * k, ry + rowH * .6, (80 + (i * 53) % 70) * k, 10 * k);
    if (ku > 0) {   // the kind of company you could already buy: a cool pill over the name
      const tx = lx + pad + 70 * k, sz = 24 * k, mw = measure(kd[0], sz, false, 600) + kd[0].length * sz * .12;
      ctx.save(); ctx.globalAlpha *= rise(ku);
      ctx.fillStyle = rgba(mixHex(P.night0, P.blue1, .6), .95); ctx.strokeStyle = rgba(COOL.line, .8); ctx.lineWidth = 1.6 * k;
      ctx.beginPath(); ctx.roundRect(tx - 8 * k, ry + rowH * .5 - 22 * k, (mw + 30 * k) * expoOut(ku), 44 * k, 22 * k); ctx.fill(); ctx.stroke();
      E.glowText(ctx, kd[0], tx + 7 * k, ry + rowH * .5 + 8.5 * k, { size: sz, weight: 600, spacing: .12, col: COOL.text, glow: false });
      ctx.restore();
    }
    ctx.strokeStyle = rgba(COOL.body, .6); ctx.lineWidth = 2.2 * k; ctx.beginPath();   // a tiny sparkline
    for (let q = 0; q <= 12; q++) { const px = lx + w - pad - 150 * k + q * 11 * k, py = ry + rowH / 2 + 12 * k * Math.sin(q * .9 + i * 2.1 + t * .1); q ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke(); ctx.fillStyle = rgba(P.cream, .08); ctx.fillRect(lx + pad, ry + rowH - 1, w - pad * 2, 1);
  }
  ctx.globalAlpha = a;
  if (antU > 0) {   // the new row: gold, slides down from the top edge
    const ry = top + (antU - 1) * rowH;
    ctx.fillStyle = rgba(GOLD.deep, .35 * antU); ctx.fillRect(lx, ry, w, rowH);
    const df = sineIO(clamp(o.diff ?? 0));
    if (df > 0) { ctx.strokeStyle = rgba(GOLD.line, .9 * df); ctx.lineWidth = 3 * k; ctx.beginPath(); ctx.roundRect(lx + 10 * k, ry + 4 * k, w - 20 * k, rowH - 8 * k, 18 * k); ctx.stroke(); halo(ctx, lx + w / 2, ry + rowH / 2, w * .45, .18 * df, GOLD.halo, GOLD.core); }
    shard(ctx, t, lx + pad + 26 * k, ry + rowH / 2, 46 * k, { glow: .5 });
    const L = o.letters ?? [1, 1, 1];
    ['A', 'N', 'T'].forEach((ch, i) => goldText(ctx, [[ch, clamp(L[i] ?? 0)]], lx + pad + 70 * k + i * 30 * k, ry + rowH * .62, 34 * k, rise(clamp((L[i] ?? 0) * 3) || antU * .6), { serif: false, weight: 600 }));
    const tp = clamp(o.tap ?? 0); if (tp > 0 && tp < 1) { ctx.strokeStyle = rgba(GOLD.core, .7 * (1 - tp)); ctx.lineWidth = 3 * k; ctx.beginPath(); ctx.arc(lx + w * .55, ry + rowH / 2, 10 * k + 140 * k * tp, 0, TAU); ctx.stroke(); }
    // tags under the new row
    (o.tags ?? []).forEach(([txt, tu, strike, g], i) => {
      tu = clamp(tu); if (tu <= 0) return; const tx = lx + pad, ty = ry + rowH + (44 + i * 66) * k, sz = 30 * k;
      const m = goldText(ctx, [[txt, g ?? 0]], tx + 14 * k, ty + 10 * k, sz, rise(tu), { serif: false, weight: 600, col: P.cream });
      ctx.strokeStyle = rgba(g ? GOLD.line : P.halo2, .6 * rise(tu)); ctx.lineWidth = 1.6 * k; ctx.beginPath(); ctx.roundRect(tx, ty - 28 * k, m.w + 28 * k, 52 * k, 26 * k); ctx.stroke();
      if (strike > 0) { ctx.strokeStyle = rgba(P.cream, .9); ctx.lineWidth = 3 * k; ctx.beginPath(); ctx.moveTo(tx - 6 * k, ty - 2 * k); ctx.lineTo(tx - 6 * k + (m.w + 40 * k) * expoOut(strike), ty - 2 * k); ctx.stroke(); }
    });
  }
  // --- the detail page (slides in from the right)
  if (dt > 0) {
    const dx = x + w * (1 - dt);
    shard(ctx, t, dx + w / 2, y + 200 * k, 120 * k, { glow: .8 });
    goldText(ctx, [['ANT', 1]], dx + w / 2, y + 340 * k, 64 * k, rise(span(dt, .4, 1)), { serif: false, weight: 600, align: 'center', spacing: .2 });
    const pu = clamp(o.price ?? 0);
    if (pu > 0) {   // the price slot: digits roll and never settle (the final price is not set yet)
      const roll = ['$ 7', '$ 7', '$ 7'].map((s, i) => s + ((Math.floor(t * 9 + i * 3) % 9) + 0) + '.' + ((Math.floor(t * 13 + i) % 90) + 10));
      ctx.globalAlpha = a * rise(pu) * .9; E.glowText(ctx, roll[0], dx + w / 2, y + 470 * k, { size: 70 * k, serif: true, align: 'center', col: COOL.body, glow: false });
      ctx.globalAlpha = a * rise(span(pu, .4, 1)); E.glowText(ctx, 'NOT YET SET', dx + w / 2, y + 530 * k, { size: 26 * k, weight: 600, align: 'center', spacing: .2, col: P.halo2, glow: false });
      ctx.globalAlpha = a;
    }
    const bu = clamp(o.buy ?? 0);
    if (bu > 0) {
      const bw = (w - pad * 2) * expoOut(bu), bh = 100 * k, bx = dx + w / 2 - bw / 2, by = y + h - 200 * k, pr = bump(o.press ?? 0, 0, 1);
      ctx.save(); ctx.translate(dx + w / 2, by + bh / 2); ctx.scale(1 - .04 * pr, 1 - .06 * pr); ctx.translate(-(dx + w / 2), -(by + bh / 2));
      ctx.fillStyle = lin(ctx, bx, by, bx, by + bh, [[0, GOLD.hot], [1, GOLD.mid]]); ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, bh / 2); ctx.fill();
      if (bu > .5) E.glowText(ctx, 'BUY', dx + w / 2, by + bh * .64, { size: 40 * k, weight: 600, align: 'center', spacing: .25, col: P.night1, glow: false, a: span(bu, .5, 1) });
      ctx.restore(); if (pr > 0) halo(ctx, dx + w / 2, by + bh / 2, bw * .7, .35 * pr, GOLD.halo, GOLD.core);
      if (o.q > 0) goldText(ctx, [['?', 1]], dx + w / 2, by - 40 * k, 90 * k, rise(o.q), { serif: true, align: 'center' });
    }
  }
  ctx.restore(); ctx.restore();
}

// ======================================================================================================================== TAGS, VEIL, FLOAT
// a paper tag on a gold thread: (x, y) = where the thread is tied (top); o.len thread length; swing in on u
export function priceTag(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const size = o.size ?? 30, len = (o.len ?? 120) * expoOut(u), lines = Array.isArray(text) ? text : [text];
  const tw = Math.max(...lines.map((l) => measure(l, size, false, 600) + size * l.length * .1)), w = tw + size * 2.1, h = size * (1.25 + lines.length * 1.25);
  const sw = (o.swing ?? 0) + (1 - expoOut(u)) * .6 * Math.cos(u * 9) + .03 * Math.sin(t * 1.1 + x * .01);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw);
  goldSpan(ctx, [[0, 0], [0, len]], 0, 1, { w: 1.4, spark: false });
  ctx.translate(0, len); ctx.globalAlpha *= clamp(u * 4);
  const p = new Path2D(); p.moveTo(-w / 2, size * .55); p.lineTo(-size * .45, 0); p.lineTo(size * .45, 0); p.lineTo(w / 2, size * .55); p.lineTo(w / 2, h); p.lineTo(-w / 2, h); p.closePath();
  ctx.fillStyle = o.gold ? mixHex(GOLD.hot, PAPER.lit, .3) : lin(ctx, 0, 0, 0, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fill(p);
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.5; ctx.stroke(p);
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(0, size * .42, size * .13, 0, TAU); ctx.fill();
  lines.forEach((l, i) => E.glowText(ctx, l, 0, size * (1.55 + i * 1.25) + size * .3, { size, weight: 600, align: 'center', spacing: .1, col: PAPER.ink, glow: false, a: rise(span(u, .3 + i * .2, 1)) }));
  ctx.restore();
  return { x, y: y + len, w, h };
}
export function veil(ctx, a) { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, a); ctx.fillRect(0, 0, W, H); ctx.restore(); }
export const float = (ctx, t, k = 1) => { ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .02 * k * Math.sin(t * .6 + 1), dx = E.drift(t * 2, 16 * k, 11), dy = E.drift(t * 2, 10 * k, 17);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };

// ======================================================================================================================== THE COUNTDOWN BOARD
// top left (x 70–560, y 46–~210): COUNTDOWN TO THE BELL, a rail with four stops and a small bell glyph at its end; the current step's
// name below. Drives itself from these phrases (never animate it by hand). It sinks during clip windows and after 'Now recall the warning'.
export const BOARD = {
  steps: [
    { at: 'So before the opening bell', name: 'STEP 1 · THE PITCH' },
    { at: 'Many doubt it', name: 'STEP 2 · THE ORDERS ARE COUNTED' },
    { at: 'If the mission is unproven', name: 'STEP 3 · PRICING NIGHT', sub: 'EXPECTED WED, NOV 18' },
    { at: 'When the bell rings', name: 'STEP 4 · FIRST TRADE', sub: 'EXPECTED THU, NOV 19' },
  ],
  plus: { at: 'fifteen trading days', name: '+15 TRADING DAYS', sub: 'NASDAQ-100 FAST ENTRY RULE' },
  off: 'Now recall the warning',
};
const BT = new WeakMap();
export function boardTimes(T) {
  if (BT.has(T)) return BT.get(T);
  const st = BOARD.steps.map((s) => T.G(s.at)), plus = T.G(BOARD.plus.at, 0, st[3]), off = T.G(BOARD.off);
  const r = { st, plus, off, clips: ['C1', 'C2', 'C3'].map((id) => T.clip(id)).filter(Boolean) }; BT.set(T, r); return r;
}
export function boardState(T, t) {
  const b = boardTimes(T); let k = -1; for (let i = 0; i < 4; i++) if (t >= b.st[i] - .2) k = i;
  const clipHide = b.clips.reduce((m, c) => Math.max(m, span(t, c.start - 1.2, c.start - .4) * (1 - span(t, c.end + .2, c.end + 1))), 0);
  return { k, on: smooth(span(t, b.st[0] - .3, b.st[0] + .9)) * (1 - smooth(span(t, b.off - .2, b.off + .8))) * (1 - clipHide),
    step: k >= 0 ? span(t, b.st[k] - .2, b.st[k] + .7) : 0, plus: span(t, b.plus, b.plus + 1.2), days: clamp((t - b.plus - .6) / 4.5) };
}
export function board(ctx, t, T, o = {}) {
  const S = boardState(T, t), a = (o.a ?? 1) * S.on; if (a <= 0) return;
  const big = sineIO(clamp(o.big ?? 0)), sc = lerp(1, 1.9, big), x0 = lerp(72, W / 2 - 245 * 1.9, big), y0 = lerp(58, 300, big);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x0, y0); ctx.scale(sc, sc); ctx.globalAlpha *= a;
  E.glowText(ctx, 'COUNTDOWN TO THE BELL', 0, 0, { size: 17, weight: 600, spacing: .16, col: P.halo2, glow: false });
  const rx = 6, ry = 34, gap = 92;
  ctx.strokeStyle = rgba(P.cream, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx + gap * 4 + 12, ry); ctx.stroke();
  if (S.k >= 0) { const prog = S.k + S.step; goldSpan(ctx, [[rx, ry], [rx + gap * Math.min(4, prog), ry]], 0, 1, { w: 1.6, spark: S.step < 1 }); }
  for (let i = 0; i < 4; i++) {
    const cx = rx + gap * (i + 1) - gap * .5 + gap * .5, done = i < S.k ? 1 : i === S.k ? S.step : 0;
    ctx.fillStyle = mixHex(P.night1, GOLD.body, done); ctx.strokeStyle = rgba(done > 0 ? GOLD.line : P.cream, .8); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx - gap * .5, ry, 9, 0, TAU); ctx.fill(); ctx.stroke();
    E.glowText(ctx, String(i + 1), cx - gap * .5, ry + 34, { size: 15, weight: 600, align: 'center', col: done > 0 ? GOLD.text : P.halo2, glow: false });
  }
  // the bell glyph at the end of the rail
  const bx = rx + gap * 4 + 34, ring = S.k >= 3 ? bump(t, boardTimes(T).st[3], 1.4) : 0;
  ctx.save(); ctx.translate(bx, ry - 14); ctx.rotate(.25 * ring * Math.sin(t * 14));
  ctx.fillStyle = S.k >= 3 ? GOLD.body : rgba(P.cream, .55); ctx.beginPath(); ctx.moveTo(-6, 0); ctx.quadraticCurveTo(-8, 18, -14, 26); ctx.lineTo(14, 26); ctx.quadraticCurveTo(8, 18, 6, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(0, 30, 3.5, 0, TAU); ctx.fill(); ctx.restore();
  if (ring > 0) halo(ctx, bx, ry, 60, .4 * ring, GOLD.halo, GOLD.core);
  // the current step's name (rises on the step change)
  if (S.k >= 0) {
    const s = BOARD.steps[S.k], nu = rise(S.step);
    goldText(ctx, [[s.name, .9]], 0, 108, 22, nu, { serif: false, weight: 600, spacing: .04 });
    if (s.sub && S.plus <= 0) maskLine(ctx, [[s.sub, 0]], 0, 136, 15, rise(span(S.step, .3, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
    if (S.plus > 0) {   // +15 TRADING DAYS: fifteen small marks fill one by one (a second count, not a clock)
      goldText(ctx, [[BOARD.plus.name, 1]], 0, 140, 20, rise(S.plus), { serif: false, weight: 600, spacing: .06 });
      for (let d = 0; d < 15; d++) { const f = clamp(S.days * 15 - d); ctx.fillStyle = f > 0 ? mixHex(P.blue1, GOLD.body, f) : rgba(P.cream, .25); ctx.fillRect(d * 25, 156, 18, 8); }
      maskLine(ctx, [[BOARD.plus.sub, 0]], 0, 188, 14, rise(span(S.plus, .3, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
    }
  }
  ctx.restore();
}

// ======================================================================================================================== SOURCES (on screen, y ≤ 880)
// Einblendungen vo-v3 (fact-checked, 16.11.; faktencheck.md MB1–MB5 applied). Use F.source(ctx, t, t0, t1, F.SOURCES.x). Wording: <ROOT>vo-v3.txt EINBLENDUNG lines.
export const SOURCES = {
  hookLine: 'EXPECTED FIRST TRADE: THU, NOV 19, 2026 · NASDAQ: ANT',
  s1risk: 'ANTHROPIC, IPO PROSPECTUS (FORM S-1/A, NOV 10, 2026), RISK FACTORS',
  s1riskText: '“Concerns have been raised both within our organization and by other researchers … that sufficiently advanced AI systems could, if not developed, deployed, and operated with appropriate safeguards, oversight, and security measures, pose catastrophic or existential risks to humanity …”',   // vo-v3: checked against S-1/A No. 2 of Nov 10, 2026
  asOf: 'NOT INVESTMENT ADVICE · AS OF NOV 17, 2026 · FINAL PRICE NOT YET SET',
  firstTrade: 'FIRST TRADE EXPECTED NOV 19 (COMPANY TIMETABLE, SUBJECT TO REGULATORY CLEARANCE)',
  range: 'SOURCE: ANTHROPIC, NOV 10, 2026',
  ipoRank: '2ND-LARGEST IPO EVER, BY MONEY RAISED · AFTER SPACEX (JUNE 2026)',   // 2nd fact check (coordinator, 16.11.)
  s1a: 'SOURCE: RENAISSANCE CAPITAL',
  retail: 'UP TO 20 % OF THE SHARES FOR RETAIL INVESTORS (S-1/A)',   // optional (Jakob decides)
  votes: 'SOURCE: ANTHROPIC PROSPECTUS (S-1/A), NOV 10, 2026',
  prospectus: 'SOURCE: ANTHROPIC PROSPECTUS',
  riskFactors: 'ANTHROPIC PROSPECTUS, RISK FACTORS',
  ltbtCard: 'LONG-TERM BENEFIT TRUST · 4 TRUSTEES (1 SEAT OPEN) · CAN "ELECT AND REMOVE A MAJORITY" OF THE BOARD',
  ltbt: 'SOURCE: ANTHROPIC PROSPECTUS (S-1/A), NOV 10, 2026',
  metaCard: 'FOUNDER CONTROL IS COMMON · META: ZUCKERBERG ≈ 61 % OF VOTES (APRIL 2026) · NEW AT ANTHROPIC: A TRUST WITH NO SHARES',   // text card only: no logos, no faces
  meta: 'SOURCE: FORTUNE, OCT 26, 2026',
  stewards: 'ANTHROPIC PROSPECTUS, ON ITS FOUNDERS',
  levine: 'NYC COMPTROLLER MARK LEVINE, LETTER OF OCT 14, 2026',
  ap: 'GOVERNANCE EXPERT QUOTED BY THE ASSOCIATED PRESS, NOV 13, 2026',
  pace: 'DARIO AMODEI, ESSAY "WE MUST PACE THE FRONTIER", SEP 12, 2026 · HELD-BACK MODEL: AMODEI ON X, OCT 2026',
  valuation: 'SOURCES: FORTUNE, CNN, CNBC, NOV 10, 2026',
  revenue: 'SOURCE: ANTHROPIC PROSPECTUS AND FACT SHEET',
  orders: 'SOURCE: BLOOMBERG, NOV 12, 2026 (UNNAMED SOURCES)',
  ridiculous: 'NEW CONSTRUCTS, QUOTED BY INC.',
  nasdaq: 'NASDAQ-100 FAST ENTRY RULE, SINCE MAY 1, 2026',
  warren: 'SEN. ELIZABETH WARREN, LETTER OF OCT 27, 2026',
  pbc: 'SOURCE: ANTHROPIC PROSPECTUS',
};

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE · UN WEB TV)
// The plate grows out of a thing in the scene (o.from = { x, y, w, h } screen rect, e.g. a crystal facet; or [cx, cy, r]) and shrinks back.
// Frames: <F59CLIPS or /tmp/claude-0/f59/clips/>/<id>/f00001.jpg… (30 fps, 1920×1080, from <ROOT>clips/Cn.mp4 trimmed to in/out of
// clips/schnitt.json; written by tools/f59_clips.py frames). Until the frames exist a placeholder shows (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
export const CLIPS = {
  C1: { name: 'Dario Amodei', role: 'CEO, Anthropic', year: 'UN Security Council, Sep 23, 2026', src: 'UN Web TV' },
  C2: { name: 'Yoshua Bengio', role: 'Turing Award laureate · Co-chair, UN scientific panel on AI', year: 'UN Security Council, Sep 23, 2026', src: 'UN Web TV' },
  C3: { name: 'Dario Amodei', role: 'CEO, Anthropic', year: 'UN Security Council, Sep 23, 2026', src: 'UN Web TV', tag: 'FORECAST' },
};
const CLIPDIR = (process.env.F59CLIPS || '/tmp/claude-0/f59/clips/').replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
function frameAt(id, t, win) { const n = frameCount(id); if (!n) return 0; return Math.max(1, Math.min(n, Math.floor((t - win.start) * 30) + 1)); }
const framePath = (id, k) => `${CLIPDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const frameCache = new Map();
export function clipWin(T, id) { const c = T.clip && T.clip(id); return c ? { start: c.start, end: c.end } : null; }
export async function prepareClipFrames(T, t) {
  for (const id of Object.keys(CLIPS)) {
    const win = clipWin(T, id); if (!win || t < win.start - 7 || t > win.end + .8) continue;
    const k = frameAt(id, t, win); if (!k) continue;
    const f = framePath(id, k); if (frameCache.has(f)) continue;
    if (frameCache.size > 48) frameCache.delete(frameCache.keys().next().value);
    frameCache.set(f, await loadImage(fs.readFileSync(f)));
  }
}
function plateBox(o, R) {
  const m = sineIO(clamp(o.morph ?? 1)), f = o.from ?? [R.x + R.w / 2, R.y + R.h / 2, 20];
  const fr0 = Array.isArray(f) ? { cx: f[0], cy: f[1], w: f[2] * 2, h: f[2] * 2, r: f[2] } : { cx: f.x + f.w / 2, cy: f.y + f.h / 2, w: f.w, h: f.h, r: Math.min(8, f.w / 2) };
  return { m, cx: lerp(fr0.cx, R.x + R.w / 2, m), cy: lerp(fr0.cy, R.y + R.h / 2, m), w: lerp(fr0.w, R.w, m), h: lerp(fr0.h, R.h, m), rr: lerp(fr0.r, 14, m) };
}
// o: { from, morph 0..1 (0 = the source shape, 1 = CLIP_RECT), dark 0..1, credits (false = none), label 0..1 }
export function clipPlate(ctx, t, T, id, o = {}) {
  const R = CLIP_RECT, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], dark = clamp(o.dark ?? 0);
  const { m, cx, cy, w, h, rr } = plateBox(o, R);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const shape = () => { ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); };
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const k = frameAt(id, t, win), fr = k ? frameCache.get(framePath(id, k)) : null;
  if (fr) { const s = Math.max(R.w / fr.width, R.h / fr.height) * (w / R.w), dw = fr.width * s, dh = fr.height * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1; }
  else {
    const u = clamp((t - win.start) / (win.end - win.start));
    ctx.fillStyle = rad(ctx, cx, cy - h * .05, w * .7, [[0, rgba(P.blue0, .5 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); E.glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy + 10, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .4, cy + h * .12, w * .8 * u, 3); ctx.globalAlpha = 1; }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  const lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {
    const by = R.y - 26, nw = maskLine(ctx, [[info.name, 0]], R.x, by, 38, rise(lu), { glow: true });
    maskLine(ctx, [[[info.role, info.year].join(' · ').toUpperCase(), 0]], R.x + nw.w + 20, by - 2, 17, rise(lu), { serif: false, col: P.halo2, glow: false });
    goldText(ctx, [[`${info.tag ? info.tag + ' · ' : ''}ORIGINAL FOOTAGE (${info.src.toUpperCase()})`, .45]], R.x + R.w, R.y + R.h + 34 > 1060 ? by - 32 : by - 32, 17, rise(lu), { serif: false, weight: 600, align: 'right' });
  }
  ctx.restore();
  return { cx, cy, w, h };
}
