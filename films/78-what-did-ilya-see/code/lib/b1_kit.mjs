// Film 78 · B1 helpers (c02–c06 only; the shared kit stays lib/f78_kit.mjs, owned by the lead).
// Every piece draws in the caller's space (put it under S.view), takes u-style 0..1 progress values the voice drives, and never creates
// canvases per frame (the one offscreen canvas for the cool-light figures is made once at load).
import { createCanvas, Image } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as F from './f78_kit.mjs';
import * as S from './f78_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL, INK, rise, maskLine, measure } = F;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------------------------------------ text
// caps label (Inter 700, spaced), rising behind its baseline mask; g = gold share (0 cream … 1 gold)
export function caps(ctx, txt, x, y, size, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  return F.goldText(ctx, [[txt, o.g ?? 0]], x, y, size, rise(u), { serif: false, weight: o.weight ?? 700, spacing: o.spacing ?? .1, align: o.align, col: o.col ?? CREAM });
}
// a serif line (quotes, numbers), rising behind its mask
export function serif(ctx, txt, x, y, size, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  return F.goldText(ctx, [[txt, o.g ?? 0]], x, y, size, rise(u), { serif: true, align: o.align, col: o.col ?? CREAM });
}
// a quote whose words turn gold as the VO speaks them: words = [{ w, s }] (T.GW), x/y = first baseline, wraps at maxW. u = the reveal.
export function spokenQuote(ctx, t, words, x, y, size, u, o = {}) {
  u = clamp(u); if (u <= 0) return { h: 0 };
  const maxW = o.maxW ?? 1400, lines = []; let cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && measure(nx.map((q) => q.w).join(' '), size, true) > maxW) { lines.push(cur); cur = [wd]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const lh = size * 1.18;
  lines.forEach((ln, li) => {
    const lw = measure(ln.map((q) => q.w).join(' '), size, true);
    let xx = o.align === 'center' ? x - lw / 2 : x;
    for (const q of ln) {
      const lit = clamp((t - q.s + .05) / .3), col = mixHex(o.dim ?? CREAM2, o.lit ?? GOLD.text, lit);
      maskLine(ctx, [[q.w + ' ', 0]], xx, y + li * lh, size, rise(span(u, li * .12, .7 + li * .12)), { serif: true, col: o.ink ? mixHex(PAPER.faint, o.ink, lit) : col, glow: false });
      xx += measure(q.w + ' ', size, true);
    }
  });
  return { h: lines.length * lh, lines: lines.length };
}
// clean a VO word list for display (strip the VO's punctuation quotes, keep the words)
export const words = (ws) => ws.map((q) => ({ w: q.w.replace(/["“”]/g, ''), s: q.s }));

// ------------------------------------------------------------------------------------------------ threads
// a soft thread from a to b (sagging a little), drawn to u; brk 0..1 = it snaps in the middle (the two ends curl back)
export function thread(ctx, t, a, b, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const brk = clamp(o.brk ?? 0), col = o.col ?? CREAM, w = o.w ?? 2, sag = o.sag ?? .08, fl = o.flicker ?? 0;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + Math.hypot(b[0] - a[0], b[1] - a[1]) * sag;
  const pt = (s) => { const q = 1 - s; return [q * q * a[0] + 2 * q * s * mx + s * s * b[0], q * q * a[1] + 2 * q * s * my + s * s * b[1]]; };
  const al = (o.a ?? .8) * (fl > 0 ? 1 - fl * (.5 + .5 * Math.sin(t * 31 + a[0])) : 1);
  ctx.save(); ctx.strokeStyle = rgba(col, al); ctx.lineWidth = w; ctx.lineCap = 'round';
  if (o.dash) ctx.setLineDash(o.dash);
  const seg = (s0, s1) => { if (s1 <= s0) return; ctx.beginPath(); const n = 28; for (let i = 0; i <= n; i++) { const s = lerp(s0, s1, i / n); let [x, y] = pt(s); y += brk * 46 * Math.max(0, 1 - Math.abs(s - .5) / .5) ** 2; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); };
  if (brk <= 0) seg(0, u);
  else { const g = .45 * brk; seg(0, Math.min(u, .5 - g)); if (u > .5 + g) seg(.5 + g, u); }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ a call tile (bust, no face)
export function tile(ctx, t, R, o = {}) {
  const { x, y, w, h } = R, kind = o.kind ?? 'person', dark = clamp(o.dark ?? 0);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(x + 6, y + 9, w, h, w * .025); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, w * .025); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(P.ind1, P.blue1, .45)], [1, mixHex(P.night1, P.ind1, .5)]]); ctx.fillRect(x, y, w, h);
  const s = h / 300, cx = x + w / 2, hy = y + h * .42, gold = kind === 'ilya';
  const body = gold ? mixHex(P.night1, GOLD.deep, .6) : kind === 'grey' ? mixHex(P.night1, CREAM2, .25) : mixHex(P.night1, P.blue1, .45), rim = gold ? GOLD.line : mixHex(P.blue0, P.cream, .45);
  halo(ctx, cx + 30 * s, hy - 20 * s, 190 * s, gold ? .22 : .1, gold ? GOLD.halo : COOL.halo, gold ? GOLD.hot : COOL.core);
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(cx, hy, 46 * s, 56 * s, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx - 130 * s, y + h); ctx.bezierCurveTo(cx - 126 * s, y + h * .68, cx - 60 * s, hy + 62 * s, cx, hy + 62 * s); ctx.bezierCurveTo(cx + 60 * s, hy + 62 * s, cx + 126 * s, y + h * .68, cx + 130 * s, y + h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(rim, .8); ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.ellipse(cx, hy, 46 * s, 56 * s, 0, -1.2, .6); ctx.stroke();
  if (dark > 0) { ctx.fillStyle = rgba(P.night0, .9 * dark); ctx.fillRect(x, y, w, h); }
  ctx.restore();
  ctx.strokeStyle = gold && (o.ring ?? 0) > 0 ? rgba(GOLD.line, .6 + .4 * Math.sin(t * 6)) : rgba(CREAM2, .45); ctx.lineWidth = Math.max(1.5, w * .006);
  ctx.beginPath(); ctx.roundRect(x, y, w, h, w * .025); ctx.stroke();
  if (o.label && w > 150) {
    const ls = Math.max(18, h * .075);
    ctx.fillStyle = rgba(P.night0, .6); ctx.fillRect(x + w * .04, y + h - ls * 2.9, measure(o.label, ls, false, 700) + ls * o.label.length * .09 + ls * 1.2, ls * 2.5);
    E.glowText(ctx, o.label, x + w * .04 + ls * .5, y + h - ls * 1.75, { size: ls, weight: 700, spacing: .08, col: gold ? GOLD.text : CREAM, glow: false });
    if (o.sub) E.glowText(ctx, o.sub, x + w * .04 + ls * .5, y + h - ls * .72, { size: ls * .82, weight: 600, spacing: .08, col: CREAM2, glow: false });
  }
  ctx.restore();
}
// the call window chrome (a frame round the tiles); R = whole window
export function callFrame(ctx, R, date, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(R.x + 10, R.y + 14, R.w, R.h, 14); ctx.fill();
  ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 14); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .55); ctx.lineWidth = 2; ctx.stroke();
  const ch = 48; for (let i = 0; i < 3; i++) { ctx.fillStyle = rgba(CREAM2, .55); ctx.beginPath(); ctx.arc(R.x + 26 + i * 20, R.y + ch * .5, 5, 0, TAU); ctx.fill(); }
  if (date) F.goldText(ctx, [[date, .6]], R.x + R.w / 2, R.y + 33, 22, 1, { serif: false, weight: 700, spacing: .1, align: 'center' });
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ figures in cool light (the machine's copies)
const OFF = createCanvas(W, H), OX = OFF.getContext('2d');
// draws E.person into the offscreen with the caller's transform, recolours it with cool light, composites it back
export function coolFigure(ctx, t, x, y, h, o = {}) {
  const m = ctx.getTransform();
  OX.setTransform(1, 0, 0, 1, 0, 0); OX.clearRect(0, 0, W, H);
  OX.setTransform(m);
  const hands = E.person(OX, x, y, h, { light: 1, ...o });
  if (o.bag) { OX.fillStyle = '#fff'; OX.beginPath(); OX.roundRect(x - h * .2 * (o.dir ?? 1) - h * .06, y - h * .7, h * .12, h * .2, h * .02); OX.fill(); }
  OX.setTransform(1, 0, 0, 1, 0, 0);
  OX.globalCompositeOperation = 'source-atop';
  const [sx, sy] = [m.a * x + m.c * (y - h) + m.e, m.b * x + m.d * (y - h) + m.f], sh = h * Math.hypot(m.a, m.b);
  OX.fillStyle = lin(OX, sx, sy, sx, sy + sh, [[0, rgba(COOL.core, .95)], [.4, rgba(COOL.body, .9)], [1, rgba(COOL.deep, .85)]]); OX.fillRect(0, 0, W, H);
  OX.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  halo(ctx, sx, sy + sh * .45, sh * .9, .2 * (o.a ?? 1), COOL.halo, COOL.core);
  ctx.globalAlpha *= o.a ?? 1; ctx.drawImage(OFF, 0, 0); ctx.restore();
  return hands;
}

// ------------------------------------------------------------------------------------------------ fly-into / lens (a detail opens out of a thing)
// The opening (design space, under S.view(cam)): { x, y, w, h } rect or { cx, cy, r } circle. u 0..1: 0 = the thing, 1 = the inner scene
// fills the frame (inner drawn in plain design px, the 1920×1080 layout, exactly as if it were the main picture). Run u backwards for
// a pull-back out of it. o.zoom (default true): the outside grows with the opening (a camera flight INTO it); false = a lens that
// opens over a still outside. outer(ctx) / inner(ctx) draw in design space (the caller's S.view is already set).
export function fly(ctx, t, cam, from, u, outer, inner, o = {}) {
  u = clamp(u); const k = o.ease ? o.ease(u) : sineIO(u);
  const circ = from.r != null, rc = circ ? [from.cx, from.cy] : [from.x + from.w / 2, from.y + from.h / 2];
  const zf = circ ? Math.hypot(W, H) / 2 / from.r : Math.max(W / from.w, H / from.h);
  const su = Math.exp(lerp(Math.log(1 / zf), 0, k)), cu = [lerp(rc[0], W / 2, k), lerp(rc[1], H / 2, k)];
  const Q = (c) => { c.translate(cu[0], cu[1]); c.scale(zf * su, zf * su); c.translate(-rc[0], -rc[1]); };   // outer → glued to the opening
  const P = (c) => { c.translate(cu[0], cu[1]); c.scale(su, su); c.translate(-W / 2, -H / 2); };             // inner layout → the opening
  const base = ctx.getTransform();
  if (u < 1 && outer) { ctx.save(); if (o.zoom !== false) Q(ctx); outer(ctx); ctx.restore(); }
  if (u > 0 && inner) {
    ctx.save(); Q(ctx);
    ctx.beginPath(); if (circ) ctx.arc(rc[0], rc[1], from.r, 0, Math.PI * 2); else ctx.roundRect(from.x, from.y, from.w, from.h, o.radius ?? 0);
    ctx.clip(); ctx.setTransform(base);   // clip under Q (napi canvas transforms the path at clip time)
    if (o.bg !== false) { const m = ctx.getTransform(); ctx.setTransform(1, 0, 0, 1, 0, 0); if (o.bg) o.bg(ctx); else S.stage(ctx, t, cam, { dawn: o.dawn ?? 0 }); ctx.setTransform(m); }
    P(ctx); inner(ctx, su); ctx.restore();
    if (u < 1 && (o.edge ?? true)) {   // the edge of the opening (thin), gone when it fills the frame
      ctx.save(); Q(ctx); ctx.strokeStyle = rgba(o.edgeCol ?? CREAM, .8 * (1 - span(u, .75, 1))); ctx.lineWidth = 2.5 / (zf * su);
      ctx.beginPath(); if (circ) ctx.arc(rc[0], rc[1], from.r, 0, Math.PI * 2); else ctx.roundRect(from.x, from.y, from.w, from.h, o.radius ?? 0); ctx.stroke(); ctx.restore();
    }
  }
}

// ------------------------------------------------------------------------------------------------ small things
// a folder (night, gold edge) with cards inside; R = front face; n cards (0..), each a small screenshot card
export function folder(ctx, t, R, o = {}) {
  const { x, y, w, h } = R, open = clamp(o.open ?? 1);
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(x + 10, y + 14, w, h, 12); ctx.fill();
  ctx.fillStyle = mixHex(GOLD.deep, P.night1, .45); ctx.beginPath(); ctx.moveTo(x, y + 30); ctx.lineTo(x + w * .3, y + 30); ctx.lineTo(x + w * .36, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .7); ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  return { x, y, w, h };
}
// a screenshot card (a chat screenshot: two bubbles), centre x, y, width w
export function shot(ctx, x, y, w, o = {}) {
  const h = w * 1.25, a = clamp(o.a ?? 1); if (a <= 0 || w < 3) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .6); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .08); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .85); ctx.lineWidth = Math.max(1, w * .02); ctx.stroke();
  ctx.fillStyle = rgba(COOL.body, .75); ctx.beginPath(); ctx.roundRect(-w * .38, -h * .36, w * .6, h * .14, w * .05); ctx.fill();
  ctx.fillStyle = rgba(CREAM, .6); ctx.beginPath(); ctx.roundRect(-w * .2, -h * .12, w * .58, h * .14, w * .05); ctx.fill();
  ctx.fillStyle = rgba(COOL.body, .55); ctx.beginPath(); ctx.roundRect(-w * .38, h * .12, w * .48, h * .14, w * .05); ctx.fill();
  ctx.restore();
}
// a gold tick of light (learned), centre x, y, size s, u draws it
export function tick(ctx, x, y, s, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  F.goldSpan(ctx, [[x - s * .5, y], [x - s * .12, y + s * .38], [x + s * .6, y - s * .45]], 0, sineIO(u), { w: o.w ?? s * .07, spark: u < 1, col: o.col });
}
// an arrow along pts (cream or gold), u draws it, head at the end
export function arrow(ctx, pts, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const end = F.goldSpan(ctx, pts, 0, sineIO(u), { w: o.w ?? 2, spark: false, col: o.col, a: o.a ?? 1 });
  if (!end || u < .15) return;
  const n = pts.length, [ax, ay] = pts[n - 2], an = Math.atan2(end[1] - ay, end[0] - ax), hs = o.head ?? 14;
  ctx.save(); ctx.fillStyle = (o.col ?? GOLD).body ?? GOLD.body; ctx.globalAlpha *= o.a ?? 1; ctx.translate(end[0], end[1]); ctx.rotate(an);
  ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(-hs, -hs * .55); ctx.lineTo(-hs * .6, 0); ctx.lineTo(-hs, hs * .55); ctx.closePath(); ctx.fill(); ctx.restore();
}
// a floor under a group of figures: a faint gold line with a pool of light
export function floor(ctx, x0, x1, y, a = 1, col = GOLD) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, (x0 + x1) / 2, y, (x1 - x0) * .55, [[0, rgba(col.halo, .16 * a)], [1, rgba(col.halo, 0)]]);
  ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, y, (x1 - x0) * .55, 40, 0, 0, TAU); ctx.fill(); ctx.restore();
  F.goldSpan(ctx, [[x0, y], [x1, y]], 0, 1, { w: 1, spark: false, a: .45 * a, col });
}
// a ground band (the open land under the big sky)
export function ground(ctx, y, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = lin(ctx, 0, y, 0, y + 400, [[0, mixHex(P.night1, P.ind1, .45)], [1, P.night0]]); ctx.fillRect(-6000, y, 16000, 3000);
  ctx.restore();
  F.goldSpan(ctx, [[-6000, y], [10000, y]], 0, 1, { w: 1, spark: false, a: .3 * a });
}
// a lamp pool (warm light from above onto a desk/figure)
export function lamp(ctx, x, y, r, a = 1, col = GOLD) { halo(ctx, x, y, r, .32 * a, col.halo, col.hot ?? col.core); }
// a top light (a soft cone from above onto a figure or a thing); col = GOLD | COOL-ish; a 0..1
export function topLight(ctx, x, y, h, a = 1, col = GOLD, wide = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, y - h * 2.6, 0, y, [[0, rgba(col.hot ?? col.core, 0)], [.55, rgba(col.halo, .07 * a)], [1, rgba(col.hot ?? col.core, .2 * a)]]);
  ctx.beginPath(); ctx.moveTo(x - h * .1 * wide, y - h * 2.8); ctx.lineTo(x + h * .1 * wide, y - h * 2.8); ctx.lineTo(x + h * .55 * wide, y); ctx.lineTo(x - h * .55 * wide, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(col.hot ?? col.core, .16 * a); ctx.beginPath(); ctx.ellipse(x, y, h * .55 * wide, h * .06, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// a figure standing on the ground with its own light: E.person (or o.du → E.du) + a pool + an optional top light
export function figure(ctx, t, x, y, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u), yy = y + (1 - k) * h * 1.15 + (o.sink ?? 0) * h * 1.15;
  const sk = clamp(o.sink ?? 0);
  if (o.top) topLight(ctx, x, y, h, o.top * k * (1 - sk), o.topCol ?? GOLD, o.wide ?? 1);
  halo(ctx, x, y - h * .55, h * .95, (o.glow ?? .2) * k * (1 - sk), o.glowCol?.halo ?? COOL.halo, o.glowCol?.core ?? COOL.core);
  ctx.save(); ctx.beginPath(); ctx.rect(x - h * 3, y - h * 3, h * 6, h * 3 + 2); ctx.clip();
  const f = o.du ? E.du : E.person;
  const hands = f(ctx, x, yy, h, { light: 1, look: .3, rim: o.du ? undefined : mixHex(P.blue0, P.cream, .6), back: .25, ...o.fig });
  ctx.restore();
  return hands;
}

// soft cuts inside a footage plate: the camera switches inside a pre-cut clip (C3: 3 hard cuts) dissolve over n frames.
// After clipPlate at full size (morph 1, dark 0): the last frame of the old shot lies over the new one and fades out linearly
// (calm.py / smooth.py: a hard cut is a 60+ jump; spread over 9 steps it stays < 12). cuts = first frame numbers of the new shots.
const SOFT = new Map();
function clipFrame(id, k) {
  const dir = (process.env.F78CLIPS || '/tmp/claude-0/f78/clips/').replace(/\/?$/, '/'), p = `${dir}${id}/f${String(k).padStart(5, '0')}.jpg`;
  if (!SOFT.has(p)) { let img = null; try { img = new Image(); img.src = fs.readFileSync(p); } catch { img = null; } SOFT.set(p, img); }
  return SOFT.get(p);
}
// napi Image decodes after the current tick: preload at import (preloadCuts) so the first dissolve frame has its picture
export function preloadCuts(id, cuts) { for (const c of cuts) clipFrame(id, c - 1); }
export function softCuts(ctx, t, T, id, cuts, a = 1, n = 8) {
  const c = T.clip && T.clip(id); if (!c || a <= 0) return;
  const k = Math.floor((t - c.start) * 30 + 1e-6) + 1, R = F.CLIP_RECT;
  for (const cut of cuts) {
    const i = k - cut; if (i < 0 || i >= n) continue;
    const fr = clipFrame(id, cut - 1); if (!fr) return;
    const s = Math.max(R.w / fr.width, R.h / fr.height), dw = fr.width * s, dh = fr.height * s, cx = R.x + R.w / 2, cy = R.y + R.h / 2;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a * (1 - (i + 1) / (n + 1));
    ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 14); ctx.clip();
    ctx.drawImage(fr, cx - dw / 2, cy - dh / 2, dw, dh); ctx.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = P.cream; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 14); ctx.stroke(); ctx.restore();
  }
}
