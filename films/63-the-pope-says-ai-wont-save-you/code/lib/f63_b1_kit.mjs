// Film 63 · builder B1 (c02–c06) · own helpers on top of lib/f63_kit.mjs (the kit stays untouched). Everything deterministic, seeded,
// nothing created per frame except reused offscreen canvases. Colour code as the kit: GOLD = the machine / the promise / the point,
// CREAM = questions and outlines, WHITE = the Pope, yellow = you, indigo/blue = everyone else.
import { createCanvas } from '@napi-rs/canvas';
import * as F from './f63_kit.mjs';
import * as E from './f10_editorial.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER, halo, rad, lin, prng } = F;
export const TAU = Math.PI * 2;

// ---------------------------------------------------------------- small motion helpers
// eased value through keys [[t, v], …] (sineIO between keys, held outside)
export function keys(t, K, ease = sineIO) {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 0; i < K.length - 1; i++) if (t < K[i + 1][0]) return lerp(K[i][1], K[i + 1][1], ease(span(t, K[i][0], K[i + 1][0])));
  return K[K.length - 1][1];
}
// a camera that glides through [[t, cx, cy, z], …] (sineIO per leg, log-zoom) + a slow drift so it never stops
export function cam(t, K, dr = 1) {
  let c = K[0];
  if (t >= K[K.length - 1][0]) c = K[K.length - 1];
  else for (let i = 0; i < K.length - 1; i++) if (t >= K[i][0] && t < K[i + 1][0]) { const u = sineIO(span(t, K[i][0], K[i + 1][0])); c = [t, lerp(K[i][1], K[i + 1][1], u), lerp(K[i][2], K[i + 1][2], u), Math.exp(lerp(Math.log(K[i][3]), Math.log(K[i + 1][3]), u))]; break; }
  return [c[1] + E.drift(t, 5 * dr, 3), c[2] + E.drift(t, 3 * dr, 7), c[3] * (1 + .004 * dr * Math.sin(t * .37))];
}
export const bump = F.bump;
// a damped swing (pendulum / settle) starting at t0: returns −1..1 decaying
export const swing = (t, t0, f = 1.6, d = 2.2) => (t < t0 ? 0 : Math.sin((t - t0) * f * TAU) * Math.exp(-(t - t0) * d));

// ---------------------------------------------------------------- QUOTE CARD (as F.quoteCard, but returns every word's box)
const nz = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const QC = new Map();
function wrapWords(text, size, w) {
  const k = text + '|' + size + '|' + w; if (QC.has(k)) return QC.get(k);
  const words = text.split(/\s+/), lines = []; let cur = [];
  // measured exactly as qcard sets it: each word's own width + a gap of .26 size (not the font's space), so no line can run past w
  const lineW = (ws) => ws.reduce((m, x) => m + F.measure(x, size, true), 0) + Math.max(0, ws.length - 1) * size * .26;
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && lineW(nx) > w) { lines.push(cur); cur = [wd]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const over = lines.map(lineW).filter((x) => x > w + .5);
  if (over.length) console.warn(`[b1 qcard] OVERFLOW ${Math.round(Math.max(...over))} > ${w}: ${text.slice(0, 40)}`);
  QC.set(k, lines); return lines;
}
export function spokenTimes(T, words, spoken, after = -1) {
  if (!spoken || !T) return null;
  try { const ws = T.GW(spoken[0], spoken[1], after); const out = []; let j = 0; for (const wd of words) { const n = nz(wd); let hit = null; for (let q = j; q < ws.length; q++) if (n && nz(ws[q].w) === n) { hit = ws[q].s; j = q + 1; break; } out.push(hit); } return out; } catch { return null; }
}
// o: { text, x, y, w, size, head, credit, u, spoken: [from, to], after, out (0..1 the text sinks), rot, paper (default) | night,
//      litAt(k, word) → time the word lights (instead of spoken), noCard (text only: the caller draws the paper) }
export function qcard(ctx, t, T, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const size = o.size ?? 50, w = o.w ?? 1100, pad = 50, lines = wrapWords(o.text, size, w - pad * 2);
  const head = o.head ? 66 : 26, h = head + lines.length * size * 1.22 + (o.credit ? 78 : 40);
  const flat = lines.flat(), times = spokenTimes(T, flat, o.spoken, o.after ?? -1);
  const x = o.x ?? (W - w) / 2, y = o.y ?? 200, night = o.style === 'night', out = clamp(o.out ?? 0);
  if (!o.noCard) F.paperCard(ctx, t, x, y, w, h, { u, rot: o.rot ?? -.004, head: o.head, headSize: o.headSize ?? 22, style: o.style, a: o.a });
  const boxes = [];
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3); ctx.translate(x, y + (1 - expoOut(u)) * 40);
  let k = 0;
  lines.forEach((ln, li) => {
    let xx = pad; const yy = head + (li + 1) * size * 1.22;
    for (const wd of ln) {
      const tt = times ? times[k] : o.litAt ? o.litAt(k, wd) : null, lit = tt == null ? 0 : clamp((t - tt + .05) / .25);
      const base = night ? P.cream : PAPER.ink, hot = night ? GOLD.text : GOLD.deep;
      const col = mixHex(times ? mixHex(night ? P.halo2 : PAPER.faint, base, tt == null ? .55 : .55 + .45 * lit) : base, hot, lit * .9);
      const ru = rise(span(u, .3 + li * .08, .9 + li * .08)) * (1 - sineIO(out));
      if (!(o.hide && o.hide(k, wd))) F.maskLine(ctx, [[wd, 0]], xx, yy, size, ru, { serif: true, col, glow: false });
      const ww = F.measure(wd, size, true); boxes.push({ w: wd, x: x + xx, y: y + yy, ww, k, lit }); xx += ww + size * .26; k++;
    }
  });
  if (o.credit) F.maskLine(ctx, [[o.credit.toUpperCase(), 0]], pad, h - 30, 20, rise(span(u, .55, 1)) * (1 - sineIO(out)), { serif: false, weight: 600, col: night ? P.halo2 : PAPER.faint, glow: false });
  ctx.restore();
  return { x, y, w, h, boxes };
}

// ---------------------------------------------------------------- PAPER TEXT (greeked lines = tiny words)
export function greek(ctx, x, y, w, rows, lh, seed, col, o = {}) {
  const r = prng(seed); ctx.fillStyle = col;
  for (let i = 0; i < rows; i++) {
    const yy = y + i * lh; if ((o.clipY && (yy < o.clipY[0] || yy > o.clipY[1])) || (o.skipY && yy > o.skipY[0] && yy < o.skipY[1])) { r(); continue; }
    let xx = x; const end = x + w * (i % 9 === 8 ? .55 + r() * .3 : 1);
    while (xx < end - 6) { const ww = Math.min(end - xx, lh * (.6 + r() * 2.2)); ctx.fillRect(xx, yy, ww, Math.max(1.2, lh * .28)); xx += ww + lh * .42; }
    r();
  }
}

// ---------------------------------------------------------------- THE ENCYCLICAL (a tall printed letter)
// (x, y) = top centre, w, h = visible height (unrolls), o: { roll 0..1 (the paper below the top edge), title 0..1, lines 0..1, given 0..1, hi (y of a gold line) }
export function letter(ctx, t, x, y, w, h, o = {}) {
  const r = clamp(o.roll ?? 1), hh = h * r; if (hh < 2) return;
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(x - w / 2 + 10, y + 14, w, hh, 6); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(x - w / 2, y, w, hh, 4); ctx.fill();
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.rect(x - w / 2, y, w, hh); ctx.clip();
  const L = x - w / 2 + 56, IW = w - 112;
  F.capsLabel(ctx, 'ENCYCLICAL LETTER', x, y + 74, o.title ?? 1, { size: 22, col: PAPER.faint });
  F.maskLine(ctx, [['Magnifica humanitas', 0]], x, y + 150, 64, rise(o.title ?? 1), { serif: true, col: PAPER.ink, glow: false, align: 'center' });
  F.capsLabel(ctx, 'OF THE HOLY FATHER LEO XIV', x, y + 196, o.title ?? 1, { size: 22, col: PAPER.faint });
  ctx.fillStyle = rgba(GOLD.shade, .8); ctx.fillRect(x - 40, y + 224, 80 * clamp(o.title ?? 1), 2);
  const lu = clamp(o.lines ?? 1);
  if (lu > 0) { ctx.save(); ctx.globalAlpha *= lu; greek(ctx, L, y + 262, IW, Math.floor((h - 300) / 22), 22, o.seed ?? 5, rgba(PAPER.ink, .38), { skipY: o.skip }); ctx.restore(); }
  if ((o.given ?? 0) > 0) F.capsLabel(ctx, 'GIVEN IN ROME, 15 MAY 2026', x, y + h - 50, o.given, { size: 22, col: PAPER.faint });
  ctx.restore();
  // the rolled lower edge while it unrolls (a cylinder of paper)
  if (r < 1) { ctx.fillStyle = lin(ctx, 0, y + hh - 14, 0, y + hh + 14, [[0, PAPER.shade], [.5, PAPER.lit], [1, PAPER.edge]]); ctx.beginPath(); ctx.roundRect(x - w / 2 - 8, y + hh - 14, w + 16, 28, 14); ctx.fill(); }
}

// ---------------------------------------------------------------- A SEARCH FIELD (pill, magnifier glyph, typed text + caret)
export function searchField(ctx, t, x, y, w, h, text, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const ww = w * lerp(.2, 1, expoOut(u));
  ctx.save(); ctx.globalAlpha *= clamp(u * 4);
  ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .6), .95); ctx.beginPath(); ctx.roundRect(x - ww / 2, y - h / 2, ww, h, h / 2); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .9); ctx.lineWidth = 2.5; ctx.stroke();
  const gx = x - ww / 2 + h * .55, gy = y - 2;
  ctx.strokeStyle = GOLD.line; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(gx, gy - 4, h * .16, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(gx + h * .12, gy + h * .08); ctx.lineTo(gx + h * .24, gy + h * .2); ctx.stroke();
  const size = o.size ?? h * .42, tx = gx + h * .45;
  ctx.save(); ctx.beginPath(); ctx.roundRect(x - ww / 2, y - h / 2, ww, h, h / 2); ctx.clip();
  if (text) E.glowText(ctx, text, tx, y + size * .36, { size, weight: 600, col: P.cream, glow: false, spacing: .06 });
  const cw = text ? F.measure(text, size, false, 600) + text.length * size * .06 : 0;
  if (o.caret !== false) { const bl = .5 + .5 * Math.cos(t * TAU * .9); ctx.fillStyle = rgba(GOLD.body, .35 + .65 * bl); ctx.fillRect(tx + cw + 6, y - size * .55, 3, size * 1.1); }
  ctx.restore(); ctx.restore();
}

// ---------------------------------------------------------------- SYMBOLS (drawn as gold/cream line icons with a glow), s = size
// kinds: heal (heartbeat in a circle) · connect (two linked dots) · educate (a slate) · protect (a roof over a small globe) ·
//        patents (a sealed document) · algorithms (a node graph) · platforms (a grid of tiles) · data (stacked discs)
export function symbol(ctx, kind, x, y, s, u = 1, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const lit = clamp(o.lit ?? 1), col = mixHex(CREAM, GOLD.body, lit), k = expoOut(u);
  ctx.save(); ctx.translate(x, y); ctx.scale(lerp(.6, 1, k), lerp(.6, 1, k)); ctx.globalAlpha *= clamp(u * 2.5) * (o.a ?? 1);
  if (lit > 0) halo(ctx, 0, 0, s * .9, .35 * lit, GOLD.halo, GOLD.core);
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = s * .045; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.ring !== false) { ctx.save(); ctx.globalAlpha *= .55; ctx.beginPath(); ctx.arc(0, 0, s * .5, 0, TAU); ctx.stroke(); ctx.restore(); }
  const S = s * .5;
  ctx.beginPath();
  if (kind === 'heal') { ctx.moveTo(-S * .7, 0); ctx.lineTo(-S * .3, 0); ctx.lineTo(-S * .15, -S * .45); ctx.lineTo(S * .05, S * .4); ctx.lineTo(S * .2, -S * .15); ctx.lineTo(S * .3, 0); ctx.lineTo(S * .7, 0); ctx.stroke(); }
  else if (kind === 'connect') { ctx.moveTo(-S * .38, S * .1); ctx.lineTo(S * .38, -S * .1); ctx.stroke(); ctx.beginPath(); ctx.arc(-S * .42, S * .12, S * .16, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(S * .42, -S * .12, S * .16, 0, TAU); ctx.fill(); }
  else if (kind === 'educate') { ctx.rect(-S * .55, -S * .38, S * 1.1, S * .7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-S * .35, -S * .12); ctx.lineTo(S * .1, -S * .12); ctx.moveTo(-S * .35, S * .08); ctx.lineTo(S * .3, S * .08); ctx.moveTo(-S * .2, S * .32); ctx.lineTo(-S * .35, S * .6); ctx.moveTo(S * .2, S * .32); ctx.lineTo(S * .35, S * .6); ctx.stroke(); }
  else if (kind === 'protect') { ctx.moveTo(-S * .66, -S * .02); ctx.lineTo(0, -S * .6); ctx.lineTo(S * .66, -S * .02); ctx.stroke(); ctx.beginPath(); ctx.arc(0, S * .26, S * .3, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, S * .26, S * .13, S * .3, 0, 0, TAU); ctx.moveTo(-S * .3, S * .26); ctx.lineTo(S * .3, S * .26); ctx.stroke(); }
  else if (kind === 'patents') { ctx.rect(-S * .4, -S * .55, S * .8, S * 1.05); ctx.stroke(); ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(-S * .24, -S * .32 + i * S * .18); ctx.lineTo(S * .24, -S * .32 + i * S * .18); } ctx.stroke(); ctx.beginPath(); ctx.arc(S * .2, S * .36, S * .16, 0, TAU); ctx.fill(); }
  else if (kind === 'algorithms') { const N = [[0, -S * .5], [-S * .45, 0], [S * .45, 0], [-S * .2, S * .5], [S * .3, S * .5]]; ctx.moveTo(...N[0]); ctx.lineTo(...N[1]); ctx.moveTo(...N[0]); ctx.lineTo(...N[2]); ctx.moveTo(...N[1]); ctx.lineTo(...N[3]); ctx.moveTo(...N[2]); ctx.lineTo(...N[4]); ctx.moveTo(...N[1]); ctx.lineTo(...N[4]); ctx.stroke(); for (const n of N) { ctx.beginPath(); ctx.arc(n[0], n[1], S * .12, 0, TAU); ctx.fill(); } }
  else if (kind === 'platforms') { for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.roundRect(-S * .52 + i * S * .37, -S * .52 + j * S * .37, S * .3, S * .3, S * .06); if ((i + j) % 2) ctx.fill(); else ctx.stroke(); } }
  else if (kind === 'data') { for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, -S * .38 + i * S * .36, S * .48, S * .16, 0, 0, TAU); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-S * .48, -S * .38); ctx.lineTo(-S * .48, S * .34); ctx.moveTo(S * .48, -S * .38); ctx.lineTo(S * .48, S * .34); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------- THE PROMISE CARD (c02 end → c03 start): a night card with a gold edge;
// flip 0..1 (0 = the question side, 1 = A PROMISE), cloth 0..1 (it turns into a hanging banner), tear 0..1 (the banner tears and falls)
export const PCARD = { x: W / 2, y: 470, w: 1160, h: 250 };
export function promiseCard(ctx, t, o = {}) {
  const { x, y, w, h } = PCARD, flip = clamp(o.flip ?? 1), cloth = clamp(o.cloth ?? 0), tear = clamp(o.tear ?? 0);
  const sy = Math.abs(Math.cos(Math.PI * flip)), front = flip < .5;
  const halves = tear > 0 ? [-1, 1] : [0];
  for (const side of halves) {
    ctx.save();
    if (side) {   // each half swings down from its outer rope and drops
      const g = expoIn(span(tear, .25, 1)), sw = sineIO(span(tear, 0, .6));
      const px = x + side * w / 2, py = y - h / 2;
      ctx.translate(px, py + g * 900); ctx.rotate(side * (-.9 * sw - .5 * g)); ctx.translate(-px, -py);
      ctx.beginPath(); if (side < 0) ctx.rect(x - w / 2 - 60, y - h - 400, w / 2 + 60 + jag(0), h * 3 + 400); else ctx.rect(x, y - h - 400, w / 2 + 60, h * 3 + 400);
      // a torn edge: jagged clip
      ctx.beginPath(); const pts = tornEdge(x, y, h); if (side < 0) { ctx.moveTo(x - w, y - h * 2); pts.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(x - w, y + h * 2); } else { ctx.moveTo(x + w, y - h * 2); pts.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(x + w, y + h * 2); } ctx.closePath(); ctx.clip();
    }
    ctx.translate(x, y); ctx.scale(1, Math.max(.02, sy)); ctx.translate(-x, -y);
    // cloth: a soft sag of the top edge + ropes
    const sag = cloth * 26;
    ctx.save();
    ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(x - w / 2 + 10, y - h / 2 + 14, w, h, 18 * (1 - cloth)); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2); ctx.quadraticCurveTo(x, y - h / 2 + sag * 2, x + w / 2, y - h / 2); ctx.lineTo(x + w / 2, y + h / 2); ctx.quadraticCurveTo(x, y + h / 2 + sag * 2 + 10 * cloth * Math.sin(t * 1.7), x - w / 2, y + h / 2); ctx.closePath();
    ctx.fillStyle = cloth > 0 ? lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.night1, P.ind2, .5)], [.5, mixHex(P.night1, P.ind2, .5 + .25 * cloth)], [1, mixHex(P.night1, P.ind2, .45)]]) : mixHex(P.night1, P.ind2, .55);
    ctx.fill(); ctx.strokeStyle = rgba(GOLD.line, .75); ctx.lineWidth = 2.5; ctx.stroke();
    ctx.restore();
    if (front) F.question(ctx, t, o.q ?? 'WHAT IS HE ARGUING WITH?', x, y + 34, 92, { ts: o.qts });
    else { const tw = F.measure('A PROMISE', 150, true); F.goldText(ctx, [['A PROMISE', 1]], x, y + 54 + sag * .6, 150, o.pu ?? 1, { serif: true, glow: true, align: 'center' }); void tw; }
    ctx.restore();
  }
  if (cloth > 0) {   // the ropes it hangs from (up out of frame)
    const ru = 1 - span(tear, .1, .4);
    if (ru > 0) for (const s of [-1, 1]) { ctx.strokeStyle = rgba(P.halo2, .7 * ru); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + s * w / 2, y - h / 2); ctx.lineTo(x + s * (w / 2 + 40), y - h / 2 - 400 * cloth); ctx.stroke(); }
  }
}
const jag = () => 0;
const TORN = [];
function tornEdge(x, y, h) { if (!TORN.length) { const r = prng(41); for (let i = 0; i <= 14; i++) TORN.push([(r() - .5) * 46, i / 14]); } return [[x, y - h * 2]].concat(TORN.map(([dx, v]) => [x + dx, y - h / 2 + v * h])).concat([[x, y + h * 2]]); }

// ---------------------------------------------------------------- A HEIGHT GAUGE (a ruler with a gold level marker)
export function gauge(ctx, t, x, y0, y1, level, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const yy1 = lerp(y0, y1, expoOut(u));
  ctx.save(); ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, yy1); ctx.stroke();
  for (let i = 0; i <= 10; i++) { const yy = lerp(y0, y1, i / 10); if ((yy - yy1) * Math.sign(y0 - y1) < 0) continue; ctx.beginPath(); ctx.moveTo(x - (i % 5 ? 8 : 16), yy); ctx.lineTo(x, yy); ctx.stroke(); }
  if (level != null && u > .5) {
    const ly = lerp(y0, y1, level), a = span(u, .5, 1);
    ctx.globalAlpha *= a;
    ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.moveTo(x + 4, ly); ctx.lineTo(x + 26, ly - 12); ctx.lineTo(x + 26, ly + 12); ctx.closePath(); ctx.fill();
    halo(ctx, x + 14, ly, 26, .5, GOLD.halo, GOLD.core);
    if (o.q > 0) F.maskLine(ctx, [['?', 1]], x + 40, ly + 18, 52, rise(o.q), { serif: true, col: GOLD.body, glow: true });
  }
  ctx.restore();
}

// ---------------------------------------------------------------- A PARLIAMENT (a domed government building), (x, base) foot centre, s = width
export function dome(ctx, t, x, base, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = expoOut(u), h = s * .62 * k, col = o.col ?? mixHex(P.blue1, P.cream, .22), sh = mixHex(col, P.night1, .5);
  ctx.save(); ctx.beginPath(); ctx.rect(x - s, base - s * 2, s * 2, s * 2); ctx.clip();
  const bw = s, by = base - h * .5;
  ctx.fillStyle = lin(ctx, x - bw / 2, 0, x + bw / 2, 0, [[0, sh], [.6, col], [1, sh]]);
  ctx.fillRect(x - bw / 2, by, bw, h * .5);   // the hall
  ctx.fillStyle = rgba(P.night0, .5); for (let i = 0; i < 6; i++) ctx.fillRect(x - bw * .42 + i * bw * .16, by + h * .1, bw * .05, h * .36);   // columns
  ctx.fillStyle = lin(ctx, x - bw / 2, 0, x + bw / 2, 0, [[0, sh], [.6, col], [1, sh]]);
  ctx.fillRect(x - bw * .55, by - h * .06, bw * 1.1, h * .07);   // the cornice
  ctx.beginPath(); ctx.ellipse(x, by - h * .06, bw * .28, h * .4, 0, Math.PI, 0); ctx.fill();   // the dome
  ctx.fillRect(x - 2, by - h * .5, 4, h * .08); ctx.beginPath(); ctx.arc(x, by - h * .52, 5, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(P.cream, .45); ctx.fillRect(x - bw * .55, by - h * .06, bw * 1.1, 2);
  ctx.restore();
}

// ---------------------------------------------------------------- A DIAL (a control knob with a scale arc and a label)
export function dial(ctx, t, x, y, r, ang, label, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  ctx.save(); ctx.translate(x, y); const k = expoOut(u); ctx.scale(k, k);
  ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r * 1.28, Math.PI * .75, Math.PI * 2.25); ctx.stroke();
  for (let i = 0; i <= 8; i++) { const a = Math.PI * .75 + i / 8 * Math.PI * 1.5; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 1.28, Math.sin(a) * r * 1.28); ctx.lineTo(Math.cos(a) * r * 1.42, Math.sin(a) * r * 1.42); ctx.stroke(); }
  ctx.fillStyle = lin(ctx, -r, -r, r, r, [[0, mixHex(P.blue1, P.cream, .2)], [1, P.night1]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .7); ctx.lineWidth = 2; ctx.stroke();
  ctx.rotate(ang); ctx.fillStyle = GOLD.body; ctx.fillRect(-3, -r * .92, 6, r * .6);
  halo(ctx, 0, -r * .8, r * .25, .5, GOLD.halo, GOLD.core);
  ctx.restore();
  if (label) F.capsLabel(ctx, label, x, y + r * 1.75, span(u, .4, 1), { size: 24, col: GOLD.text });
}

// ---------------------------------------------------------------- A BIG HAND (indigo, not the Pope's): wrist (x, y), palm length s, angle, o.curl 0..1
export function bigHand(ctx, x, y, s, ang, o = {}) {
  const p = E.handPath({ pose: o.pose ?? 'open', curl: o.curl ?? 0, spread: o.spread });
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s * (o.flip ?? 1));
  ctx.fillStyle = lin(ctx, -3, 0, 1.5, 0, [[0, mixHex(P.night1, P.ind1, .3)], [.7, o.col ?? mixHex(P.ind2, P.blue1, .55)], [1, mixHex(P.blue1, P.cream, .25)]]); ctx.fill(p);
  ctx.strokeStyle = rgba(o.rim ?? P.halo2, .55); ctx.lineWidth = .035; ctx.stroke(p);
  ctx.restore();
}

// ---------------------------------------------------------------- A NEWSPAPER (front page, the three photos come from the tiles)
export function newspaper(ctx, t, x, y, w, h, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); const s = o.s ?? 1; ctx.scale(s, s);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(-w / 2 + 12, -h / 2 + 16, w, h);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = PAPER.ink; ctx.fillRect(-w / 2 + 40, -h / 2 + 96, w - 80, 3); ctx.fillRect(-w / 2 + 40, -h / 2 + 104, w - 80, 1.5);
  E.glowText(ctx, 'SPECIAL EDITION', 0, -h / 2 + 76, { size: 40, serif: true, col: PAPER.ink, glow: false, align: 'center' });
  if (o.head !== false) E.glowText(ctx, 'BEST NEWS IN HISTORY', 0, -h / 2 + 200, { size: 92, serif: true, col: PAPER.ink, glow: false, align: 'center' });
  greek(ctx, -w / 2 + 40, h / 2 - 150, w - 80, 6, 20, 13, rgba(PAPER.ink, .35));
  ctx.restore();
}
// photo slots on the newspaper (design space, unrotated, s = 1): returns [x, y, w, h] relative to the paper centre
export const NEWS_PHOTO = (i, w, h) => { const pw = (w - 80 - 40) / 3, ph = pw * .62; return [-w / 2 + 40 + pw / 2 + i * (pw + 20), -h / 2 + 248 + ph / 2, pw, ph]; };

// ---------------------------------------------------------------- A WEEK PLANNER (the third harvest tile): blocks lift away as free hours
// (x0, y0, w, h) = the tile's inner rect; free 0..1 (how many blocks have flown), fly(i) → callback gives each block's flight
export function planner(ctx, t, x0, y0, w, h, o = {}) {
  ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + h, [[0, mixHex(P.night1, P.ind1, .4)], [1, P.night1]]); ctx.fillRect(x0, y0, w, h);
  const cols = 7, rows = 5, gx = x0 + w * .08, gy = y0 + h * .2, cw = w * .84 / cols, rh = h * .7 / rows;
  ctx.fillStyle = rgba(P.cream, .65);
  for (let i = 0; i < cols; i++) { ctx.fillRect(gx + i * cw + cw * .3, y0 + h * .08, cw * .4, h * .04); }
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 1.2;
  for (let i = 0; i <= cols; i++) { ctx.beginPath(); ctx.moveTo(gx + i * cw, gy); ctx.lineTo(gx + i * cw, gy + rows * rh); ctx.stroke(); }
  for (let j = 0; j <= rows; j++) { ctx.beginPath(); ctx.moveTo(gx, gy + j * rh); ctx.lineTo(gx + cols * cw, gy + j * rh); ctx.stroke(); }
  const r = prng(17), free = clamp(o.free ?? 0), out = [];
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    if (r() < .18) continue;
    const ord = r(), f = span(free, ord * .6, ord * .6 + .4);
    const bx = gx + i * cw + 3, by = gy + j * rh + 3, bw = cw - 6, bh = rh - 6;
    if (f <= 0) { ctx.fillStyle = mixHex(P.shade0, P.ind1, .35); ctx.fillRect(bx, by, bw, bh); ctx.fillStyle = rgba(P.cream, .25); ctx.fillRect(bx, by, bw, 2); }
    else { ctx.strokeStyle = rgba(GOLD.line, .35); ctx.setLineDash([4, 4]); ctx.strokeRect(bx, by, bw, bh); ctx.setLineDash([]); out.push({ x: bx + bw / 2, y: by + bh / 2, w: bw, h: bh, f }); }
  }
  return out;
}

// ---------------------------------------------------------------- A COUNTRY OF MINDS (lit points inside a landmass silhouette)
let COUNTRY = null;
export function countryPts() {
  if (COUNTRY) return COUNTRY;
  const r = prng(66), pts = [];
  const inside = (u, v) => { const a = Math.atan2(v, u), d = Math.hypot(u, v * 1.35); const R = .42 + .07 * Math.sin(a * 3 + .6) + .05 * Math.sin(a * 5 + 2.1) + .03 * Math.sin(a * 9); return d < R; };
  while (pts.length < 260) { const u = r() - .5, v = r() - .5; if (inside(u, v)) pts.push([u, v, r() * 6.28, r()]); }
  pts.sort((a, b) => a[3] - b[3]);
  return (COUNTRY = pts);
}

// ---------------------------------------------------------------- RECOLOUR A FIGURE (blueprint silhouette) via a reused offscreen
let OFF = null;
export function offscreen() { if (!OFF) OFF = createCanvas(W, H); const g = OFF.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W, H); return [OFF, g]; }
// draw fn into the offscreen with the CURRENT transform of ctx, tint it flat with col (alpha a), composite back
export function tinted(ctx, fn, col, a = 1) {
  const [c, g] = offscreen(); const m = ctx.getTransform(); const k = ctx.canvas.width / W;
  g.setTransform(m); fn(g); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, W * k, H * k);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a; ctx.drawImage(c, 0, 0); ctx.restore();
}

// ---------------------------------------------------------------- A ROLL (one text replaced by another, rolling up inside the line's mask)
export function rollText(ctx, a, b, x, y, size, u, draw) {
  const LH = size * 1.05; u = sineIO(u);
  ctx.save(); ctx.beginPath(); ctx.rect(-W, y - size * .95, W * 3, size * 1.22); ctx.clip();
  if (u < 1) { ctx.save(); ctx.translate(0, -u * LH); draw(a, x, y); ctx.restore(); }
  if (u > 0) { ctx.save(); ctx.translate(0, (1 - u) * LH); draw(b, x, y); ctx.restore(); }
  ctx.restore();
}
// one gold or cream word dropping in with weight (expoIn fall, small squash on landing); returns the squash
export function landing(t, t0, d = .45) { const f = expoIn(span(t, t0, t0 + d)), sq = F.bump(t, t0 + d, .3); return { f, sq }; }

// ---------------------------------------------------------------- the "yes" card (S.yesCard, but the word rises behind a mask: yesU 0..1;
// at yesU ≥ 1 it IS S.yesCard, so the seam plate takes over pixel for pixel)
import * as S from './f63_seams.mjs';
export function yesCardB(ctx, t, x, y, w, h, o = {}) {
  const yu = clamp(o.yesU ?? 1);
  if (yu >= 1) return S.yesCard(ctx, t, x, y, w, h);
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(x - w / 2 + 8, y - h / 2 + 12, w, h, 22); ctx.fill();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .55); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 22); ctx.fill();
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.stroke();
  F.glowText(ctx, '@jack', x - w / 2 + 34, y - h / 2 + 52, { size: 24, weight: 600, col: P.halo2, glow: false });
  F.glowText(ctx, 'REPOSTING @Pontifex · 26 MAY 2026', x - w / 2 + 34, y + h / 2 - 30, { size: 22, weight: 600, col: rgba(P.cream, .7), glow: false, spacing: .06 });
  if (yu > 0) {
    ctx.beginPath(); ctx.rect(x - w / 2 + 20, y + 34 - 96 * 1.05, w - 40, 96 * 1.32); ctx.clip();
    F.glowText(ctx, 'yes', x - w / 2 + 34, y + 34 + (1 - expoOut(yu)) * 96 * 1.1, { size: 96, serif: true, col: GOLD.text, glow: true });
  }
  ctx.restore();
}
