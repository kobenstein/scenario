// Film 16 · "Claude's Constitution in 10 Minutes" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (stage, palette, du/person, light, type, finish) + lib/f13_kit.mjs (trailSpan, maskLine, measure,
// textGrains/sandGrains). This file adds the Film 16 objects:
//   book()        the guiding image: an open book of light (ANCHORS ONLY: hook, end of level 5, level 6, ending). lines lift, pages
//                 riffle, the book closes; returns line anchors for threads.        bookClosed()  the closed book standing upright
//   head()        the head of light (thumbnail profile, blue) with the network inside; lit 0..1 grows it from the entry point
//   chatUI()      the chat box of levels 1–5: your bubbles (yellow edge = you), typing, Claude's reply field EMPTY with a blinking cursor.
//                 Level 6 may fill the reply field (o.reply.fill) with a meter — never with invented words.
//   cursor()      the blinking cursor (Claude's only sign in levels 1–5)
//   level()       the level stamp (rises, holds, glides into the corner) and the corner badge (7-step glyph + LEVEL n)
//   quote()       a quote card: big serif lines rise from their baselines (staggered), gold phrases warm on their words, small attribution
//   rule()        the thin gold rule a quote stands on (carrier: a thread or an outline becomes it)
//   stamp()       a rubber stamp that lands (SAFE? · CONSCIENTIOUS OBJECTOR · ANTHROPIC'S OWN TESTS · CC0 · PUBLIC DOMAIN)
//   pen()         the fountain pen of light (end of level 6 → level 7 → ending: the pen passes between hands)
//   stairs()      the staircase of light: level 2 (four values), level 5 callback, the seven-step tower of the ending
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; no fades from nowhere.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K13 from './f13_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, glowFill, halo, rad, lin, prng, drift } = E;
export const { trailSpan, maskLine, measure, textGrains, sandGrains } = K13;

// the print finish for every Film 16 entry: entry = { t, draw, print: PRINT16 }
export const PRINT16 = { grain: 14, floor: 4, vig: .5 };
export const rise = (x) => 1 - (1 - clamp(x)) ** 3;              // calm rise for text (cubic out)
export const blink = (t, t0 = 0, per = 1.06) => { const p = (((t - t0) % per) + per) % per / per; return p < .5 ? smooth(clamp(p / .06)) : 1 - smooth(clamp((p - .5) / .06)); };

// ======================================================================================================================== book
// Open book of light, seen from the front and a little above. (cx, cy) = the middle of the spine's top edge; hw = half width of the
// spread; ph = page height. The pages ARE the light (hot core near the spine, gold to the edges).
// o: { a, lift: (i, side) => 0..1 (a printed line leaves the page: its stroke is gone, its anchor is returned), riffle 0..1 (three
//      pages fan once over the right half), close 0..1 (the right half folds over onto the left; 1 = closed, lying), glow (aura scale),
//      warm 0..1 (extra page light: "we can read what it's told"), lines (per page, default 9) }
// returns { lines: { L: [[x0, y, x1]…], R: […] } (caller space, top → bottom), spine: [cx, cy], rect: [x0, y0, x1, y1], page(side,u,v) }
const BOOK_SEED = prng(1616), BOOK_JIT = Array.from({ length: 40 }, () => [BOOK_SEED(), BOOK_SEED()]);
export function book(ctx, cx, cy, hw, ph, t, o = {}) {
  const a = o.a ?? 1, close = clamp(o.close ?? 0), nl = o.lines ?? 9, warm = clamp(o.warm ?? 0);
  const sag = ph * .07, lip = ph * .05;                                       // page tops curve down from the spine; outer corners lift
  const pageL = (s) => {                                                      // s = -1 left, +1 right · local page outline
    const p = new Path2D(); const x1 = cx + s * hw;
    p.moveTo(cx, cy); p.bezierCurveTo(cx + s * hw * .25, cy + sag, cx + s * hw * .7, cy + sag * .4, x1, cy - lip);
    p.lineTo(x1 - s * hw * .015, cy + ph - lip * .4); p.bezierCurveTo(cx + s * hw * .7, cy + ph + sag * .5, cx + s * hw * .25, cy + ph + sag * 1.1, cx, cy + ph + sag * .5);
    p.closePath(); return p;
  };
  // where a point (u across 0..1 from the spine, v down 0..1) lies on a page (follows the curved top/bottom)
  const page = (s, u, v) => {
    const top = cy + sag * 4 * u * (1 - u) * .9 - lip * u * u, bot = cy + ph + sag * (1 - u) * .7 - lip * .4 * u;
    return [cx + s * hw * u, lerp(top, bot, v)];
  };
  const gl = o.glow ?? 1;
  ctx.save(); ctx.globalAlpha = a;
  // the block of pages under the spread (thickness), dark gold edges
  const blk = new Path2D(); blk.moveTo(cx - hw, cy - lip + ph * .02); blk.lineTo(cx - hw * 1.012, cy + ph - lip * .4 + ph * .05); blk.quadraticCurveTo(cx, cy + ph + sag * 1.6 + ph * .06, cx + hw * 1.012, cy + ph - lip * .4 + ph * .05); blk.lineTo(cx + hw, cy - lip + ph * .02); blk.closePath();
  const both = new Path2D(); both.addPath(pageL(-1)); both.addPath(pageL(1));
  glowFill(ctx, both, hw * .9 * gl, .45 * a, P.blue0);                       // the light lifts the night to blue round it
  glowFill(ctx, both, hw * .28 * gl, (.55 + .25 * warm) * a, P.halo1);
  ctx.fillStyle = lin(ctx, 0, cy + ph * .6, 0, cy + ph * 1.2, [[0, P.shade0], [1, mixHex(P.shade0, P.night1, .6)]]); ctx.fill(blk);
  ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = Math.max(1, ph * .004);
  for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(cx - hw * 1.004, cy + ph - lip * .4 + ph * .012 * k); ctx.quadraticCurveTo(cx, cy + ph + sag * 1.6 + ph * .012 * k, cx + hw * 1.004, cy + ph - lip * .4 + ph * .012 * k); ctx.stroke(); }
  const out = { lines: { L: [], R: [] }, spine: [cx, cy], rect: [cx - hw, cy - lip, cx + hw, cy + ph + sag], page };
  const drawPage = (s, flip = 1) => {
    const p = pageL(s);
    ctx.fillStyle = rad(ctx, cx + s * hw * .18 * flip, cy + ph * .42, hw * 1.15, [[0, P.core0], [.22, P.core1], [.55, mixHex(P.halo0, P.core1, warm * .5)], [.85, P.halo1], [1, P.shade0]]); ctx.fill(p);
    ctx.save(); ctx.clip(p);                                                   // the gutter shadow and the soft edge darkening (volume)
    ctx.fillStyle = lin(ctx, cx, 0, cx + s * hw * .16, 0, [[0, rgba(P.shade0, .55)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(cx - hw, cy - ph, 2 * hw, 3 * ph);
    ctx.filter = `blur(${ph * .02}px)`; ctx.strokeStyle = rgba(P.shade0, .45); ctx.lineWidth = ph * .05; ctx.stroke(p); ctx.restore();
    // printed lines: thin gold-shadow strokes that follow the page curve; a lifted line is gone from the page
    for (let i = 0; i < nl; i++) {
      const v = .12 + .76 * i / Math.max(1, nl - 1), j = BOOK_JIT[(i + (s > 0 ? 17 : 0)) % 40];
      const u0 = .12 + .03 * j[0], u1 = (i === nl - 1 ? .55 : .86) - .1 * j[1];
      const p0 = page(s, u0, v), p1 = page(s, u1, v), pm = page(s, (u0 + u1) / 2, v);
      const lifted = o.lift ? clamp(o.lift(i, s > 0 ? 'R' : 'L')) : 0;
      out.lines[s > 0 ? 'R' : 'L'].push([p0[0], p0[1], p1[0], p1[1], pm[0], pm[1]]);
      if (lifted >= 1) continue;
      ctx.strokeStyle = rgba(mixHex(P.shade0, P.ind2, .25), .7 * (1 - lifted)); ctx.lineWidth = Math.max(1.2, ph * .011); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.quadraticCurveTo(pm[0], pm[1] - ph * .004, p1[0], p1[1]); ctx.stroke();
    }
  };
  drawPage(-1);
  // the right half: open (close 0) → folds over the spine (scale in x) → lies on the left as the back cover (close 1)
  const fold = Math.cos(Math.PI * close);
  if (close <= 0) drawPage(1);
  else {
    ctx.save(); ctx.translate(cx, 0); ctx.scale(fold, 1); ctx.translate(-cx, 0);
    if (fold > 0) drawPage(1, 1);
    else {                                                                     // past 90°: we see the cover (dark cloth, gold rim)
      const p = pageL(1);
      ctx.fillStyle = lin(ctx, cx, cy, cx + hw, cy + ph, [[0, P.ind2], [.6, P.ind1], [1, P.night1]]); ctx.fill(p);
      ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = Math.max(1.5, ph * .008); ctx.stroke(p);
    }
    ctx.restore();
  }
  // riffle: three pages lift off the right half and sweep toward the spine and back (u 0 → 1 → 0), staggered
  const rf = clamp(o.riffle ?? 0);
  if (rf > 0 && rf < 1 && close <= 0) {
    for (let k = 0; k < 3; k++) {
      const q = clamp((rf - k * .12) / .64), ang = Math.sin(Math.PI * q) * (.55 + .12 * k);
      if (q <= 0 || q >= 1) continue;
      ctx.save(); ctx.translate(cx, 0); ctx.scale(Math.cos(ang), 1); ctx.translate(-cx, -ph * .05 * Math.sin(ang));
      const p = pageL(1); ctx.fillStyle = rad(ctx, cx + hw * .3, cy + ph * .4, hw * 1.1, [[0, P.core1], [.6, P.halo0], [1, P.halo1]]); ctx.fill(p);
      ctx.strokeStyle = rgba(P.shade0, .5); ctx.lineWidth = Math.max(1, ph * .005); ctx.stroke(p); ctx.restore();
    }
  }
  ctx.restore();
  if (warm > 0) halo(ctx, cx - hw * .45, cy + ph * .45, hw * .8, .25 * warm * a, P.halo0, P.core1);
  return out;
}
// the closed book standing upright (level 6, beside the diorama): spine toward the viewer, gold rim, a faint title band
export function bookClosed(ctx, x, y, h, t, o = {}) {
  const w = h * .72, d = h * .14, a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha = a;
  const cover = new Path2D(); cover.roundRect(x - w / 2, y - h, w, h, h * .02);
  glowFill(ctx, cover, h * .35, .35 * a, P.blue0);
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, P.ind1], [.7, P.ind2], [1, P.night1]]); ctx.fill(cover);
  ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, P.halo0], [1, P.shade0]]); ctx.fillRect(x + w / 2, y - h + d * .3, d * .5, h - d * .3);   // the page block, gold edge
  ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = Math.max(1.5, h * .008); ctx.stroke(cover);
  ctx.fillStyle = rgba(P.halo0, .85); ctx.fillRect(x - w * .32, y - h * .62, w * .64, h * .012); ctx.fillRect(x - w * .32, y - h * .55, w * .64, h * .006);
  ctx.restore();
  return { top: [x, y - h], rect: [x - w / 2, y - h, x + w / 2, y] };
}

// ======================================================================================================================== head
// The head of light (Film 11 thumbnail "smarter than ever"): a blue profile facing LEFT, height h, (x, y) = top-left of its box.
// Inside it the network (the mind words shape): nodes + threads, growing from the entry point as lit goes 0 → 1.
// o: { a, lit 0..1, flash 0..1 (one bright breath of the whole network), entry: [u, v] (box units, where threads arrive, default the
//      forehead), face: 1 (profile) | 0 (just the round cranium) }
// returns { entry:[x,y] caller space, center:[x,y], nodes:[[x,y,lit]], path }
const HEAD = (() => {   // profile in a unit box (w .8, h 1), facing left; smooth quadratic through the points
  const pts = [[.62, 1.02], [.6, .8], [.74, .66], [.8, .44], [.76, .22], [.6, .07], [.4, .02], [.22, .07], [.11, .2], [.085, .33], [.075, .4], [.035, .47],
    [.0, .53], [.045, .56], [.06, .6], [.045, .63], [.075, .66], [.07, .71], [.12, .755], [.22, .765], [.25, .8], [.26, 1.02]];
  const p = new Path2D(); p.moveTo(...pts[0]);
  for (let i = 1; i < pts.length - 1; i++) { const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2]; p.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]); }
  p.lineTo(...pts[pts.length - 1]); p.closePath();
  // nodes in the cranium (seeded, spaced), ordered later by distance to the entry
  const r = prng(4242), nodes = [];
  for (let tries = 0; nodes.length < 38 && tries < 4000; tries++) {
    const u = .2 + r() * .55, v = .1 + r() * .5;
    if (((u - .47) / .3) ** 2 + ((v - .34) / .27) ** 2 > 1) continue;
    if (nodes.some((n) => Math.hypot(n[0] - u, n[1] - v) < .065)) continue;
    nodes.push([u, v, r()]);
  }
  const edges = [];
  nodes.forEach((n, i) => { const near = nodes.map((m, j) => [Math.hypot(m[0] - n[0], m[1] - n[1]), j]).filter(([d, j]) => j !== i).sort((p, q) => p[0] - q[0]).slice(0, 3); for (const [d, j] of near) if (d < .17 && !edges.some(([a, b]) => (a === j && b === i))) edges.push([i, j]); });
  return { path: p, nodes, edges };
})();
export function head(ctx, x, y, h, t, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? 0), fl = clamp(o.flash ?? 0), m = { a: h, b: 0, c: 0, d: h, e: x, f: y };
  const path = new Path2D(); path.addPath(HEAD.path, m);
  const en = o.entry || [.2, .3], ex = x + en[0] * h, ey = y + en[1] * h;
  ctx.save(); ctx.globalAlpha = a;
  glowFill(ctx, path, h * .25, .55 * a, P.blue0);
  ctx.fillStyle = lin(ctx, x, y, x + h * .8, y + h, [[0, mixHex(P.blue0, P.blue1, .3)], [.55, P.ind1], [1, P.night1]]); ctx.fill(path);
  ctx.save(); ctx.clip(path);
  ctx.fillStyle = rad(ctx, x + h * .47, y + h * .34, h * .5, [[0, rgba(P.blue0, .9)], [.6, rgba(P.blue0, .35)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(x, y, h, h * 1.1);
  // the rim on the face side (cool light from the left: the book)
  ctx.filter = `blur(${h * .012}px)`; ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = h * .02; ctx.stroke(path); ctx.filter = 'none';
  // network: order by distance to the entry; node i is lit when lit * N > rank
  const N = HEAD.nodes.length, rank = HEAD.nodes.map((n, i) => [Math.hypot(n[0] - en[0], n[1] - en[1]), i]).sort((p, q) => p[0] - q[0]).map(([, i]) => i);
  const lv = new Array(N).fill(0); rank.forEach((i, k) => { lv[i] = clamp(lit * N * 1.08 - k); });
  const P2 = (n) => [x + n[0] * h, y + n[1] * h];
  ctx.lineCap = 'round';
  for (const [i, j] of HEAD.edges) {
    const q = Math.min(lv[i], lv[j]), [x0, y0] = P2(HEAD.nodes[i]), [x1, y1] = P2(HEAD.nodes[j]);
    ctx.strokeStyle = q > 0 ? rgba(mixHex(P.blue0, P.halo0, q), (.35 + .45 * q + .2 * fl) * a) : rgba(P.blue0, .3 * a); ctx.lineWidth = h * (.0028 + .002 * q);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  }
  const nodesOut = [];
  HEAD.nodes.forEach((n, i) => {
    const [nx, ny] = P2(n), q = lv[i], br = .85 + .15 * Math.sin(t * (1.1 + n[2]) + n[2] * 9);
    nodesOut.push([nx, ny, q]);
    if (q <= 0) { ctx.fillStyle = rgba(P.blue0, .6 * a); ctx.beginPath(); ctx.arc(nx, ny, h * .005, 0, 6.29); ctx.fill(); return; }
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, nx, ny, h * (.03 + .025 * fl), [[0, rgba(P.halo0, (.55 * q + .3 * fl) * br * a)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(nx - h * .06, ny - h * .06, h * .12, h * .12);
    ctx.restore();
    ctx.fillStyle = mixHex(P.halo1, P.core0, q * br); ctx.beginPath(); ctx.arc(nx, ny, h * (.006 + .004 * q), 0, 6.29); ctx.fill();
  });
  ctx.restore();
  ctx.strokeStyle = rgba(mixHex(P.blue0, P.cream, .3), .55 * a); ctx.lineWidth = Math.max(1, h * .003); ctx.stroke(path);
  ctx.restore();
  if (fl > 0) halo(ctx, x + h * .47, y + h * .34, h * .45, .3 * fl * a, P.halo0, P.core1);
  return { entry: [ex, ey], center: [x + h * .47, y + h * .34], nodes: nodesOut, path };
}

// ======================================================================================================================== chat
// The chat box, designed on a 1000 × 562 layout and drawn into any rect (x, y, w) (h = w * .562). Nothing in it is Claude's voice:
// your bubbles (cream text, a yellow edge: yellow is you) and Claude's reply field, EMPTY, with a blinking cursor.
// o: { a, glass 0..1 (the glass fill revealed top → bottom, default 1), bubbles: [{ text | poem: n lines, u 0..1 (rises), sag: 0..1
//      (one poem line sags) }], typing: { text, u 0..1 (share of characters), caret }, reply: { a 0..1 (field drawn), cursor 0..1,
//      fill 0..1 (level 6 only: a meter grows in the field), label }, scroll 0..1 (the conversation scrolls up out of view: new question),
//      t0 (blink phase), rim (outline strength), noFrame (just the content) }
// returns { rect, cursor: [x, y] caller space, reply: [x, y, w, h], bubbles: [[x, y, w, h]], s }
export const CHAT_AR = .5625;
export function chatUI(ctx, t, x, y, w, o = {}) {
  const s = w / 1000, h = w * CHAT_AR, a = o.a ?? 1, U = (u, v) => [x + u * s, y + v * s];
  const out = { rect: [x, y, w, h], bubbles: [], s };
  ctx.save(); ctx.globalAlpha = a;
  const frame = new Path2D(); frame.roundRect(x, y, w, h, 26 * s);
  if (!o.noFrame) {
    const gl = clamp(o.glass ?? 1);
    if (gl > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(x - 2, y - 2, w + 4, (h + 4) * gl); ctx.clip();
      ctx.fillStyle = lin(ctx, x, y, x + w * .4, y + h, [[0, mixHex(P.ind1, P.night1, .35)], [1, P.night1]]); ctx.fill(frame);
      ctx.fillStyle = lin(ctx, x, y, x + w * .5, y + h * .5, [[0, rgba(P.blue1, .16)], [.5, rgba(P.blue1, 0)]]); ctx.fill(frame);   // a soft reflection
      ctx.restore();
    }
    ctx.strokeStyle = rgba(P.blue0, (o.rim ?? 1) * .95); ctx.lineWidth = Math.max(1.2, 3 * s); ctx.stroke(frame);
  }
  ctx.save(); ctx.clip(frame);
  const sc = smooth(clamp(o.scroll ?? 0)), dy = -sc * 600;
  // your bubbles, right-aligned from the top
  let by = 46 + dy;
  for (const b of o.bubbles || []) {
    const u = rise(clamp(b.u ?? 1)); if (u <= 0) continue;
    const bh = b.poem ? 50 + 38 * b.poem : 84, bw = b.poem ? 430 : Math.min(620, K13.measure(b.text, 34, false, 500) + 70);
    const bx = 950 - bw, yy = by + (1 - u) * 26;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y + (by - 8) * s, w, (bh + 16) * s); ctx.clip();      // rises from its own baseline
    const bp = new Path2D(); const [px, py] = U(bx, yy); bp.roundRect(px, py, bw * s, bh * s, 22 * s);
    ctx.fillStyle = rgba(mixHex(P.ind2, P.blue1, .35), .95); ctx.fill(bp);
    ctx.fillStyle = P.coat; ctx.fillRect(px + bw * s - 7 * s, py + 14 * s, 4 * s, bh * s - 28 * s);   // the yellow edge: this is you
    if (b.poem) {
      for (let i = 0; i < b.poem; i++) {
        const [lx, ly] = U(bx + 34, yy + 46 + i * 38), lw = (300 - (i % 2) * 70) * s, sg = i === b.poem - 1 ? clamp(b.sag ?? 0) : 0;
        ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 3 * s; ctx.lineCap = 'round'; ctx.beginPath();
        for (let k = 0; k <= 40; k++) { const q = k / 40, xx = lx + q * lw, yy2 = ly + Math.sin(q * 19 + i * 2) * 3.2 * s + sg * q * q * 18 * s; k ? ctx.lineTo(xx, yy2) : ctx.moveTo(xx, yy2); }
        ctx.stroke();
      }
      E.glowText(ctx, '♡', ...U(bx + bw - 60, yy + 40), { size: 26 * s, col: rgba(P.halo0, .9), glow: false });
    } else E.glowText(ctx, b.text, ...U(bx + 35, yy + 54), { size: 34 * s, weight: 500, col: P.cream, glow: false });
    ctx.restore();
    out.bubbles.push([...U(bx, yy), bw * s, bh * s]);
    by += (bh + 22) * u;                                                     // the next row moves down as this bubble rises (no jump)
  }
  // Claude's reply field: left, under the bubbles; empty, a cursor
  const r = o.reply || {}, ra = clamp(r.a ?? 1);
  const rx = 50, ry = Math.max(by + 6, 300) + dy * 0, rw = 560, rh = 96;
  out.reply = [...U(rx, ry), rw * s, rh * s];
  if (ra > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(...U(rx - 20, ry - 60), (rw + 60) * s * expoOut(ra), (rh + 120) * s); ctx.clip();   // the field is drawn left → right (a wipe, never a fade)
    const rp = new Path2D(); rp.roundRect(...U(rx, ry), rw * s, rh * s, 20 * s);
    ctx.fillStyle = rgba(P.night0, .55); ctx.fill(rp); ctx.strokeStyle = rgba(P.blue1, .7); ctx.lineWidth = Math.max(1, 2 * s); ctx.stroke(rp);
    ctx.fillStyle = rgba(P.blue0, .9); ctx.beginPath(); ctx.arc(...U(rx - 2, ry + rh / 2), 7 * s, 0, 6.29); ctx.fill();   // the reply side marker
    const cu = clamp(r.cursor ?? 1);
    if (cu > 0) out.cursor = cursor(ctx, t, ...U(rx + 34, ry + rh / 2), 46 * s, { a: cu, t0: o.t0 ?? 0 });
    else out.cursor = U(rx + 34, ry + rh / 2);
    const fl = clamp(r.fill ?? 0);
    if (fl > 0) {   // level 6: the field becomes a meter (measured) — a bar of cold light grows; the label is the caller's (a number)
      const [mx, my] = U(rx + 70, ry + rh / 2 - 9);
      ctx.fillStyle = rgba(P.blue1, .5); ctx.fillRect(mx, my, (rw - 110) * s, 18 * s);
      ctx.fillStyle = lin(ctx, mx, 0, mx + (rw - 110) * s, 0, [[0, P.cream], [1, mixHex(P.cream, P.blue0, .3)]]); ctx.fillRect(mx, my, (rw - 110) * s * fl * (r.value ?? 1), 18 * s);
      if (r.label) E.glowText(ctx, r.label, ...U(rx + rw - 30, ry - 18), { size: 30 * s, serif: true, align: 'right', a: fl });
    }
    ctx.restore();
  }
  // the input line at the bottom: what you are typing
  const ty = o.typing;
  const [ix, iy] = U(50, h / s - 70);
  ctx.strokeStyle = rgba(P.blue1, .55); ctx.lineWidth = Math.max(1, 2 * s); ctx.beginPath(); ctx.moveTo(ix, iy + 22 * s); ctx.lineTo(ix + 900 * s, iy + 22 * s); ctx.stroke();
  if (ty && ty.text) {
    const n = Math.floor(clamp(ty.u ?? 1) * ty.text.length + 1e-6), str = ty.text.slice(0, n);
    E.glowText(ctx, str, ix + 6 * s, iy + 6 * s, { size: 32 * s, weight: 500, col: P.cream, glow: false });
    if (ty.caret !== false && (ty.u ?? 1) < 1) { const cw = K13.measure(str, 32 * s, false, 500); ctx.fillStyle = P.coat; ctx.fillRect(ix + 10 * s + cw, iy - 22 * s, 3 * s, 32 * s); }
  }
  ctx.restore();
  ctx.restore();
  return out;
}
// the cursor: a cream bar that blinks (smooth edges, period 1.06 s); a faint glow so it reads as light
export function cursor(ctx, t, x, y, h, o = {}) {
  const b = blink(t, o.t0 ?? 0) * (o.a ?? 1), w = Math.max(2, h * .09);
  if (b > 0) {
    ctx.save(); ctx.globalAlpha = b; ctx.fillStyle = P.cream; ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x, y, h * .9, [[0, rgba(P.core1, .35)], [1, rgba(P.core1, 0)]]); ctx.fillRect(x - h, y - h, 2 * h, 2 * h);
    ctx.restore();
  }
  return [x, y];
}

// ======================================================================================================================== level
// The level stamp and the corner badge, drawn in SCREEN space (call after the cards). One call per frame does both:
//   level(ctx, t, { n, title, t0, from })   before t0: badge `from` (if any) · t0: the stamp rises (LEVEL n + title, upper left) ·
//   t0 + 3.4: it glides into the corner and becomes the badge (the title sinks) · after: badge n. The glyph is a staircase of 7 steps;
//   steps ≤ n are lit, step n breathes. Readability: the stamp stands still ≥ 2.6 s.
const BADGE = { x: 72, y: 76, step: 12, rise: 6 }, STAMP = { x: 120, y: 214, step: 26, rise: 13 };
function glyph(ctx, x, y, step, rise, n, t, a) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 0; i < 7; i++) {
    const sx = x + i * step, sy = y - (i + 1) * rise, on = i < n, cur = i === n - 1;
    const br = cur ? .8 + .2 * Math.sin(t * 2.1) : 1;
    ctx.fillStyle = on ? rgba(cur ? P.core1 : P.halo1, (cur ? 1 : .75) * a * br) : rgba(P.blue1, .35 * a);
    ctx.fillRect(sx, sy, step - Math.max(1, step * .14), rise * (i + 1));
  }
  ctx.restore();
}
export function level(ctx, t, o) {
  const { n, title, t0 } = o, from = o.from ?? 0;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const badge = (k, a = 1) => { if (k <= 0) return; glyph(ctx, BADGE.x, BADGE.y + 2, BADGE.step, BADGE.rise, k, t, a); E.glowText(ctx, `LEVEL ${k}`, BADGE.x + 7 * BADGE.step + 16, BADGE.y, { size: 20, weight: 600, spacing: .32, col: rgba(P.cream, .9 * a), glow: false }); };
  if (t < t0) { badge(from); ctx.restore(); return; }
  const up = span(t, t0, t0 + .8), gl = quartIO(span(t, t0 + 3.4, t0 + 4.5));
  if (gl >= 1) { badge(n); ctx.restore(); return; }
  // the old badge sinks below its baseline as the new stamp rises
  if (from > 0 && up < 1) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 480, BADGE.y + 8); ctx.clip(); ctx.translate(0, expoIn(up) * 40); badge(from); ctx.restore(); }
  const gx = lerp(STAMP.x, BADGE.x, gl), gy = lerp(STAMP.y, BADGE.y, gl), st = lerp(STAMP.step, BADGE.step, gl), rs = lerp(STAMP.rise, BADGE.rise, gl);
  const k = expoOut(up);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, gy + 10); ctx.clip(); ctx.translate(0, (1 - k) * 60);
  glyph(ctx, gx, gy + 2, st, rs, n, t, 1);
  E.glowText(ctx, `LEVEL ${n}`, gx + 7 * st + lerp(26, 16, gl), gy, { size: lerp(30, 20, gl), weight: 600, spacing: .32, col: P.cream, glow: gl < .5 });
  ctx.restore();
  if (title) {   // the title rises a beat later, under the stamp; it sinks when the stamp glides
    const tu = rise(span(t, t0 + .25, t0 + 1.15)) * (1 - expoIn(span(t, t0 + 3.25, t0 + 3.9)));
    if (tu > 0) K13.maskLine(ctx, [[title, 0]], STAMP.x - 4, STAMP.y + 92, 84, tu);
  }
  ctx.restore();
}

// ======================================================================================================================== quote
// A quote card. Lines (wrapped to w at size) rise from their baselines one after another, then stand still to be read; gold phrases
// warm on their words; the attribution (Inter, small, halo gold) rises last. Sink: each line drops below its baseline (staggered).
// o: { text, attr, x, y (first baseline), size (≥ 56), w, t0 (first line starts), t1 (sink starts; ≥ t0 + 4.5 so it reads ≥ 4 s),
//      gold: [[phrase, tStart]], lead (line pitch factor 1.3), align 'left' | 'center', marks (true: curly quotes), stagger (.16 s) }
// returns { lines: [{ x, y, w }], bottom, x0, x1 }
export function quote(ctx, t, o) {
  const size = o.size ?? 60, wmax = o.w ?? 1200, lead = (o.lead ?? 1.3) * size, st = o.stagger ?? .16;
  const words = (o.marks === false ? o.text : `“${o.text}”`).split(/\s+/);
  const lines = []; let cur = [];
  for (const w of words) { const nx = [...cur, w]; if (cur.length && K13.measure(nx.join(' '), size) > wmax) { lines.push(cur); cur = [w]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  // gold: mark words that belong to a phrase occurrence
  const flat = lines.flat(), warmAt = new Array(flat.length).fill(null), nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [ph, tg] of o.gold || []) {
    const q = ph.split(/\s+/).map(nz);
    for (let i = 0; i + q.length <= flat.length; i++) if (q.every((p, j) => nz(flat[i + j]) === p)) { for (let j = 0; j < q.length; j++) warmAt[i + j] = tg; break; }
  }
  const out = { lines: [], x0: o.x, x1: o.x, bottom: o.y };
  let wi = 0;
  lines.forEach((ln, li) => {
    const y = o.y + li * lead, u = rise(span(t, o.t0 + li * st, o.t0 + li * st + .9)) * (o.t1 != null ? 1 - expoIn(span(t, o.t1 + li * .07, o.t1 + li * .07 + .55)) : 1);
    const segs = []; let lastW = null;
    ln.forEach((w, j) => {
      const tg = warmAt[wi++], warm = tg == null ? 0 : smooth(span(t, tg - .05, tg + .55)), txt = w + (j < ln.length - 1 ? ' ' : '');
      if (segs.length && lastW === tg) segs[segs.length - 1][0] += txt; else segs.push([txt, warm]);
      lastW = tg;
    });
    const lw = K13.measure(ln.join(' '), size);
    if (u > 0) K13.maskLine(ctx, segs, o.align === 'center' ? o.x : o.x, y, size, u, { align: o.align });
    out.lines.push({ x: o.align === 'center' ? o.x - lw / 2 : o.x, y, w: lw }); out.x1 = Math.max(out.x1, o.x + lw);
  });
  out.bottom = o.y + (lines.length - 1) * lead;
  if (o.attr) {
    const ta = o.t0 + lines.length * st + .35, ua = rise(span(t, ta, ta + .9)) * (o.t1 != null ? 1 - expoIn(span(t, o.t1 + lines.length * .07, o.t1 + lines.length * .07 + .55)) : 1);
    if (ua > 0) K13.maskLine(ctx, [[o.attr, 0]], o.x + (o.align === 'center' ? 0 : 3), out.bottom + size * .55 + 40, o.attrSize ?? 26, ua, { serif: false, col: P.halo2, glow: false, weight: 600, align: o.align });
    out.bottom += size * .55 + 40;
  }
  return out;
}
// the thin gold rule under / beside a quote: grows from u0 to u1 along pts (a straight line by default)
export function rule(ctx, x0, y0, x1, y1, u, o = {}) { if (u <= 0) return null; return K13.trailSpan(ctx, [[x0, y0], [x1, y1]], o.from ?? 0, u, { w: o.w ?? 2, spark: o.spark ?? u < 1, a: o.a ?? 1 }); }

// ======================================================================================================================== stamp
// A rubber stamp landing at (x, y) at time t0: it drops from 1.18× in .22 s (expo-in), hits (a breath of dust 60 ms later), settles.
// Ink: cream on night (o.ink), a rough double border, Inter 600 caps; rot in radians. o: { t0, size 40, rot -.06, ink, a, out (t: lifts away) }
export function stamp(ctx, t, text, x, y, o = {}) {
  const t0 = o.t0 ?? 0; if (t < t0 - .22) return null;
  const size = o.size ?? 40, drop = expoIn(span(t, t0 - .22, t0)), k = 1.18 - .18 * drop, hit = span(t, t0, t0 + .35);
  const away = o.out != null ? expoIn(span(t, o.out, o.out + .4)) : 0; if (away >= 1) return null;
  const tw = K13.measure(text, size, false, 600) + size * text.length * .12, bw = tw + size * 1.2, bh = size * 1.75, ink = o.ink ?? P.cream;
  ctx.save(); ctx.translate(x, y - away * 40); ctx.rotate(o.rot ?? -.06); ctx.scale(k * (1 + .02 * Math.sin(hit * Math.PI)), k);
  ctx.globalAlpha = (o.a ?? 1) * (drop < 1 ? .35 + .65 * drop : 1) * (1 - away);
  const r = prng(text.length * 31 + 7);
  ctx.strokeStyle = ink; ctx.lineWidth = size * .08;
  ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, size * .18); ctx.stroke();
  ctx.lineWidth = size * .03; ctx.beginPath(); ctx.roundRect(-bw / 2 + size * .16, -bh / 2 + size * .16, bw - size * .32, bh - size * .32, size * .1); ctx.stroke();
  E.glowText(ctx, text, 0, size * .36, { size, weight: 600, align: 'center', spacing: .12, col: ink, glow: false });
  ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,.55)';   // worn ink: a few seeded gaps
  for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.arc((r() - .5) * bw, (r() - .5) * bh, size * (.03 + r() * .05), 0, 6.29); ctx.fill(); }
  ctx.restore();
  if (hit > 0 && hit < 1) E.dust(ctx, 61, 180, x, y, bw * .6 * (.6 + hit), bh * .5, t, .6 * (1 - hit));
  return { w: bw, h: bh };
}

// ======================================================================================================================== pen
// A fountain pen of light, length L, nib at (x, y), pointing along ang (radians; -π/2 = nib down… use ang = angle FROM nib TO cap).
// The body is dark indigo with a gold rim, the nib is the light (warm core). o: { a, glow, ink 0..1 (a drop at the nib) }
// returns { nib: [x, y], cap: [x, y] }
export function pen(ctx, x, y, ang, L, t, o = {}) {
  // a FOUNTAIN pen (not a marker, not a syringe): broad split gold nib with a breather hole, a ribbed grip section, a fat barrel,
  // a gold band, a cap with a clip and a rounded end. All in L units along the axis (u from the nib tip to the cap end, v across).
  const a = o.a ?? 1, c = Math.cos(ang), s = Math.sin(ang);
  const P2 = (u, v) => [x + c * u * L - s * v * L, y + s * u * L + c * v * L];
  ctx.save(); ctx.globalAlpha *= a;
  const shape = (pts) => { const p = new Path2D(); pts.forEach(([u, v], i) => (i ? p.lineTo(...P2(u, v)) : p.moveTo(...P2(u, v)))); p.closePath(); return p; };
  // nib: tip → swelling shoulders → into the section (curves sampled)
  const side = (sg) => Array.from({ length: 13 }, (_, i) => { const u = .2 * i / 12, w = u < .14 ? .058 * Math.sin(Math.PI / 2 * u / .14) ** .8 : .058 - (.058 - .036) * (u - .14) / .06; return [u, sg * Math.max(.002, w)]; });
  const nib = shape([...side(-1), ...side(1).reverse()]);
  const section = shape([[.195, -.037], [.31, -.04], [.31, .04], [.195, .037]]);
  const barrel = shape([[.31, -.047], [.62, -.049], [.62, .049], [.31, .047]]);
  const cap = new Path2D(); cap.moveTo(...P2(.62, -.052)); cap.lineTo(...P2(.95, -.05)); cap.quadraticCurveTo(...P2(1.0, -.05), ...P2(1.0, 0)); cap.quadraticCurveTo(...P2(1.0, .05), ...P2(.95, .05)); cap.lineTo(...P2(.62, .052)); cap.closePath();
  const all = new Path2D(); all.addPath(section); all.addPath(barrel); all.addPath(cap);
  glowFill(ctx, all, L * .2, .3, P.blue0);
  const [b0x, b0y] = P2(.6, -.05), [b1x, b1y] = P2(.6, .05);
  const bodyGrad = lin(ctx, b0x, b0y, b1x, b1y, [[0, mixHex(P.ind2, P.blue1, .65)], [.45, P.ind2], [1, P.night1]]);
  for (const part of [barrel, cap]) { ctx.fillStyle = bodyGrad; ctx.fill(part); ctx.strokeStyle = rgba(P.halo1, .75); ctx.lineWidth = Math.max(1, L * .004); ctx.stroke(part); }
  ctx.fillStyle = lin(ctx, b0x, b0y, b1x, b1y, [[0, P.ind1], [1, P.night0]]); ctx.fill(section);
  ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = Math.max(1, L * .003);
  for (const u of [.23, .255, .28]) { ctx.beginPath(); ctx.moveTo(...P2(u, -.038)); ctx.lineTo(...P2(u, .038)); ctx.stroke(); }   // grip ribs
  // the gold band and the clip (on the upper side of the cap, with a ball end)
  ctx.strokeStyle = rgba(P.halo0, .95); ctx.lineWidth = Math.max(1.5, L * .014); ctx.beginPath(); ctx.moveTo(...P2(.625, -.053)); ctx.lineTo(...P2(.625, .053)); ctx.stroke();
  ctx.lineWidth = Math.max(1.5, L * .011); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...P2(.7, -.068)); ctx.lineTo(...P2(.94, -.062)); ctx.lineTo(...P2(.96, -.05)); ctx.stroke();
  ctx.fillStyle = rgba(P.halo0, .95); ctx.beginPath(); ctx.arc(...P2(.7, -.068), L * .011, 0, 6.29); ctx.fill();
  // the nib: warm metal light, a slit from the tip to the breather hole, a darker shoulder line
  glowFill(ctx, nib, L * .07 * (o.glow ?? 1), .7, P.halo0);
  const [n0x, n0y] = P2(0, 0), [n1x, n1y] = P2(.2, 0);
  ctx.fillStyle = lin(ctx, n0x, n0y, n1x, n1y, [[0, P.core0], [.45, P.core1], [1, P.halo1]]); ctx.fill(nib);
  ctx.strokeStyle = rgba(P.shade0, .8); ctx.lineWidth = Math.max(1, L * .0045); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(...P2(.008, 0)); ctx.lineTo(...P2(.1, 0)); ctx.stroke();
  ctx.beginPath(); ctx.arc(...P2(.108, 0), L * .008, 0, 6.29); ctx.stroke();
  ctx.strokeStyle = rgba(P.shade0, .45); ctx.beginPath(); ctx.moveTo(...P2(.17, -.05)); ctx.quadraticCurveTo(...P2(.155, 0), ...P2(.17, .05)); ctx.stroke();
  ctx.restore();
  halo(ctx, x, y, L * .12 * (1 + .1 * Math.sin(t * 2)), .5 * a * (o.glow ?? 1), P.halo0, P.core0);
  if (o.ink > 0) halo(ctx, x, y + L * .02, L * .05 * o.ink, .8 * o.ink * a, P.core0, P.core0);
  return { nib: [x, y], cap: P2(1, 0) };
}

// ======================================================================================================================== stairs
// A staircase of light, flat-isometric: n steps rising to the right from (x, y) (the front-bottom corner of step 1), each step w wide,
// r high, depth d (the top face is a parallelogram going up-right). o: { a, lit: [0..1 per step], labels: [..] (Inter caps, beside each
// riser), grow 0..1 (steps build bottom → top), outline: [indices drawn as empty outlines (the eighth step of the ending)], hot: index }
// returns { tops: [[x, y]] centre of each top face (caller space) }
export function stairs(ctx, t, x, y, n, w, r, d, o = {}) {
  const a = o.a ?? 1, lit = o.lit || [], gr = o.grow ?? 1, tops = [];
  for (let i = 0; i < n; i++) {
    const g = clamp(gr * n - i); if (g <= 0) { tops.push(null); continue; }
    const x0 = x + i * w, yb = y, yt = y - (i + 1) * r * expoOut(g), dx = d * .9, dy = -d * .5;
    tops.push([x0 + w / 2 + dx / 2, yt + dy / 2]);
    const front = new Path2D(); front.rect(x0, yt, w, yb - yt);
    const top = new Path2D(); top.moveTo(x0, yt); top.lineTo(x0 + dx, yt + dy); top.lineTo(x0 + w + dx, yt + dy); top.lineTo(x0 + w, yt); top.closePath();
    const L = clamp(lit[i] ?? 0), empty = (o.outline || []).includes(i);
    ctx.save(); ctx.globalAlpha = a;
    if (empty) {
      ctx.setLineDash([8, 7]); ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = 2; ctx.stroke(top); ctx.stroke(front); ctx.setLineDash([]);
    } else {
      if (L > 0) glowFill(ctx, top, w * .35 * L, .6 * L * a, P.halo0);
      ctx.fillStyle = lin(ctx, 0, yt, 0, yb, [[0, mixHex(P.ind2, P.blue1, .4 + .2 * L)], [1, P.night1]]); ctx.fill(front);
      ctx.fillStyle = L > 0 ? lin(ctx, x0, yt, x0 + w + dx, yt + dy, [[0, mixHex(P.blue1, P.halo0, L)], [.6, mixHex(P.blue0, P.core1, L)], [1, mixHex(P.blue1, P.halo1, L)]]) : mixHex(P.blue1, P.blue0, .4); ctx.fill(top);
      ctx.strokeStyle = rgba(L > 0 ? P.core1 : P.blue0, .8); ctx.lineWidth = Math.max(1, w * .012); ctx.beginPath(); ctx.moveTo(x0, yt); ctx.lineTo(x0 + w, yt); ctx.stroke();
    }
    ctx.restore();
    if (o.labels && o.labels[i]) {
      const lu = clamp(o.labelU ? o.labelU[i] : 1); if (lu > 0) K13.maskLine(ctx, [[o.labels[i], 0]], x0 + w + dx + 18, yt + dy * .2 + 12, o.labelSize ?? 30, lu, { serif: false, weight: 600, col: L > .5 ? P.cream : rgba(P.halo2, .85), glow: L > .5 });
    }
  }
  return { tops };
}

// ---------------------------------------------------------------------------------------------------------------------- helpers
// arc-length positions on a polyline (for objects that travel along a thread)
export function along(pts, u) {
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = len[len.length - 1] * clamp(u); let i = 1; while (i < pts.length - 1 && len[i] < T) i++;
  const f = (T - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], clamp(f)), lerp(pts[i - 1][1], pts[i][1], clamp(f))];
}
// a rounded rectangle as a polyline (for a thread that draws an outline)
export function roundRectPts(x, y, w, h, r, n = 6, start = 'top-left') {
  const pts = [], arc = (cx, cy, a0) => { for (let k = 0; k <= n; k++) { const q = a0 + k / n * Math.PI / 2; pts.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r]); } };
  arc(x + r, y + r, Math.PI); arc(x + w - r, y + r, -Math.PI / 2); arc(x + w - r, y + h - r, 0); arc(x + r, y + h - r, Math.PI / 2); pts.push([x, y + r]);
  return pts;
}
