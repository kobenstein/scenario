// Film 8 · paper-and-ink cards (owner: B1, chunks c03–c05). Other builders import, never edit. Signatures are FINAL.
//
//   await cardsReady()                       build the cached paper textures as Images (call once in your async default export)
//
//   quoteCard(ctx, t, o) → { rect, word(i | 'text') → {x, y, w, h} (screen), words, toScreen(px, py), local }
//       A cream letterpress card #f3ecda, ink #2a2420 (MOTION: Q1, Q2). The quote prints in word by word (a mask per word, the ink
//       pressed in: a dark first impression that settles), the Inter-caps attribution under it.
//       o = { x, y (card centre, screen), s 1 (card = 1240 × 660 px at s 1), rot 0, quote 'text', lines ['…', '…'] (manual breaks),
//             size 78 (quote px at s 1), lead 1.22, align 'center', marks true (“ ” hanging quotes), attrib 'NAME · DATE', note 'small line',
//             t0 (time of the first word), per .3 (s per word), u (override: words shown, 0 … n), attribAt (time; default after the last word),
//             breathe 1 (the card breathes ~1 %), light 1 (warm light from the upper left), shadow 1, edge 1 (deckle edge + plate mark),
//             paper (ctx, cardPath) → void: draw the paper yourself (e.g. a handoff plate clipped to the card) instead of the texture,
//             lift [ { w: 'word', u 0..1, dx, dy, rot, s } ] (words that leave the card, e.g. "2026" rising into the sky),
//             wordStyle (i, word) → { color, alpha } }
//       Card units: the card spans (−620 … 620, −330 … 330) around (x, y); word() gives screen rects at the CURRENT transform.
//
//   clipPrint(ctx, t, T, id, o) → { rect, corner [x, y], on }
//       An interview clip as a print on dark paper (C1): a rough-edged dark mat with a plate mark, the frame inside; on 0 = the print is
//       dark (only the engraved plate mark and a faint still), on 1 = the clip plays (lit from the corner where the firefly sits).
//       o = { x, y, w 1180, h 664 (picture, top-left in screen px), on 0..1 (default: from the clip window, .6 s ramps), mat 70 (paper margin),
//             rot 0, lower 0..1 (lower third; default from the clip window), name, role, tag 'ORIGINAL FOOTAGE', lowerX 140, lowerY 842,
//             corner 'tr' (where the firefly lands), glow 1 }
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, canvas, text, rough, poly } from '../engine.mjs';
import { clipFrame } from './kit.mjs';

const TAU = Math.PI * 2;
const qio = (x) => (x = clamp(x), x < .5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2);
const eoutX = (x) => (x = clamp(x), x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const CARD = { w: 1240, h: 660, paper: '#f3ecda', ink: '#2a2420', inkSoft: '#5a4e40' };

// ---------------------------------------------------------------- cached textures (canvas → Image once; drawImage(<Canvas>) leaks)
const IM = new Map(); let PEND = [];
function cached(key, w, h, paint) {
  let e = IM.get(key); if (e) return e.img || e.c;
  const [c, g] = canvas(w, h); paint(g, c); e = { c, img: null }; IM.set(key, e);
  PEND.push(loadImage(c.toBuffer('image/png')).then((im) => { e.img = im; e.c = null; }));
  return c;
}
export async function cardsReady() { cardTex(); matTex(); while (PEND.length) { const p = PEND; PEND = []; await Promise.all(p); } }

// the cream card: fibre, a faint plate impression, warm light from the upper left (2× resolution, card units × 2)
const CS = 2;
function cardTex() {
  return cached('card', CARD.w * CS, CARD.h * CS, (g) => {
    const w = CARD.w * CS, h = CARD.h * CS, r = prng(17);
    const gr = g.createRadialGradient(w * .28, h * .2, 0, w * .4, h * .4, w * .9); gr.addColorStop(0, '#f8f2e2'); gr.addColorStop(.55, '#f1e8d3'); gr.addColorStop(1, '#ddcfb0');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.lineCap = 'round';
    for (let i = 0; i < 5200; i++) { const x = r() * w, y = r() * h, L = 6 + r() * 30, a = r() * TAU, b = (r() - .5) * .8; g.strokeStyle = r() < .55 ? `rgba(120,96,60,${.05 + r() * .09})` : `rgba(255,252,244,${.12 + r() * .2})`; g.lineWidth = .6 + r() * .9; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * L * .5, y + Math.sin(a) * L * .5, x + Math.cos(a + b) * L, y + Math.sin(a + b) * L); g.stroke(); }
    // speckles of the rag pulp
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(90,70,40,${.05 + r() * .12})`; g.fillRect(r() * w, r() * h, 1 + r() * 1.6, 1 + r() * 1.6); }
    // the letterpress plate impression: a slightly debossed rectangle (shadow line top-left, light line bottom-right)
    const m = 42 * CS; g.strokeStyle = 'rgba(110,90,60,.22)'; g.lineWidth = 2; g.strokeRect(m, m, w - 2 * m, h - 2 * m);
    g.strokeStyle = 'rgba(255,252,244,.55)'; g.lineWidth = 1.4; g.strokeRect(m + 2, m + 2, w - 2 * m, h - 2 * m);
    // a soft darkening toward the edges (the card has a body)
    const v = g.createRadialGradient(w / 2, h / 2, h * .3, w / 2, h / 2, w * .66); v.addColorStop(0, 'rgba(80,60,30,0)'); v.addColorStop(1, 'rgba(80,60,30,.16)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
  });
}
// the dark printing paper of the clip print (mat), 1600 × 1000 local px
function matTex() {
  return cached('mat', 1600, 1000, (g) => {
    const w = 1600, h = 1000, r = prng(23);
    const gr = g.createRadialGradient(w * .3, h * .25, 0, w * .5, h * .5, w * .8); gr.addColorStop(0, '#1c1f3e'); gr.addColorStop(1, '#0c0d22'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.lineCap = 'round';
    for (let i = 0; i < 3800; i++) { const x = r() * w, y = r() * h, L = 4 + r() * 18, a = r() * TAU; g.strokeStyle = r() < .5 ? `rgba(170,160,230,${.04 + r() * .05})` : `rgba(0,0,0,${.1 + r() * .12})`; g.lineWidth = .6 + r() * .7; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); }
    g.strokeStyle = 'rgba(140,130,210,.05)'; g.lineWidth = 1; g.beginPath(); for (let k = -h; k < w; k += 7) { g.moveTo(k, h); g.lineTo(k + 600, 0); } g.stroke();
  });
}

// ---------------------------------------------------------------- layout of a quote (card units), cached per text
const LAY = new Map();
function layout(o) {
  const size = o.size ?? 78, lead = o.lead ?? 1.22, key = JSON.stringify([o.quote, o.lines, size, lead, o.align, o.attrib, o.note, o.marks, o.font]);
  if (LAY.has(key)) return LAY.get(key);
  const [, g] = canvas(8, 8); const font = o.font || 'Instrument Serif';
  g.font = `${size}px "${font}"`;
  let lines = o.lines;
  if (!lines) { const maxW = CARD.w - 220, ws = String(o.quote || '').split(/\s+/).filter(Boolean); lines = []; let cur = '';
    for (const w of ws) { const nx = cur ? cur + ' ' + w : w; if (cur && g.measureText(nx).width > maxW) { lines.push(cur); cur = w; } else cur = nx; } if (cur) lines.push(cur); }
  const sp = g.measureText(' ').width, words = [], lh = size * lead, hasAttr = !!o.attrib, blockH = lines.length * lh + (hasAttr ? 92 : 0) + (o.note ? 34 : 0);
  let y = -blockH / 2 + size * .8;
  lines.forEach((ln, li) => {
    const ws = ln.split(' '), wd = ws.map((w) => g.measureText(w).width), tot = wd.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
    let x = o.align === 'left' ? -CARD.w / 2 + 120 : -tot / 2;
    ws.forEach((w, i) => { words.push({ w, x, y, wd: wd[i], line: li, i: words.length }); x += wd[i] + sp; });
    y += lh;
  });
  const L = { lines, words, size, lh, font, attrY: y - lh + size * .2 + 78, noteY: y - lh + size * .2 + 78 + 34 };
  LAY.set(key, L); return L;
}

export function quoteCard(ctx, t, o = {}) {
  const s0 = o.s ?? 1, br = 1 + .01 * (o.breathe ?? 1) * Math.sin(t * TAU / 4.6), s = s0 * br, rot = o.rot ?? 0, x = o.x ?? W / 2, y = o.y ?? H / 2;
  const L = layout(o), n = L.words.length, per = o.per ?? .3, t0 = o.t0 ?? 0;
  const shown = o.u != null ? o.u : clamp((t - t0) / per + .001, 0, n);
  const cw = CARD.w / 2, ch = CARD.h / 2;
  const toScreen = (px, py) => { const c = Math.cos(rot), sn = Math.sin(rot); return [x + (px * c - py * sn) * s, y + (px * sn + py * c) * s]; };
  const edge = rough([[-cw, -ch], [cw, -ch], [cw, ch], [-cw, ch]], 2.2, 7, { step: 14 });
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  // shadow under the card (a soft dark pool on the night behind it)
  if ((o.shadow ?? 1) > 0) { ctx.save(); ctx.shadowColor = `rgba(0,0,0,${.55 * (o.shadow ?? 1)})`; ctx.shadowBlur = 40 * s; ctx.shadowOffsetX = 10 * s; ctx.shadowOffsetY = 18 * s; ctx.fillStyle = '#000'; poly(ctx, edge); ctx.fill(); ctx.restore(); }
  // the paper
  if (o.paper) { ctx.save(); poly(ctx, edge); ctx.clip(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); o.paper(ctx); ctx.restore(); ctx.restore(); }
  else { ctx.save(); poly(ctx, edge); ctx.clip(); ctx.drawImage(cardTex(), -cw, -ch, CARD.w, CARD.h); ctx.restore(); }
  if ((o.edge ?? 1) > 0) { ctx.strokeStyle = rgba('#8a7350', .35 * (o.edge ?? 1)); ctx.lineWidth = 1.2; poly(ctx, edge); ctx.stroke(); }
  // light from the upper left (very soft)
  if ((o.light ?? 1) > 0) { ctx.save(); poly(ctx, edge); ctx.clip(); const lg = ctx.createLinearGradient(-cw, -ch, cw, ch); lg.addColorStop(0, rgba('#fffaf0', .1 * (o.light ?? 1))); lg.addColorStop(1, rgba('#5a4020', .06 * (o.light ?? 1))); ctx.fillStyle = lg; ctx.fillRect(-cw, -ch, CARD.w, CARD.h); ctx.restore(); }
  // the words, pressed in one after the other
  ctx.textBaseline = 'alphabetic'; ctx.font = `${L.size}px "${L.font}"`;
  const lifts = o.lift || [];
  L.words.forEach((wd, i) => {
    const u = clamp(shown - i); if (u <= 0) return;
    const st = o.wordStyle ? o.wordStyle(i, wd.w) || {} : {}, col = st.color || CARD.ink;
    const lf = lifts.find((q) => q.w === wd.w || q.i === i);
    ctx.save();
    if (lf && (lf.u ?? 0) > 0) { const e = clamp(lf.u); ctx.translate(wd.x + wd.wd / 2, wd.y - L.size * .35); ctx.translate((lf.dx ?? 0) * e, (lf.dy ?? -200) * e); ctx.rotate((lf.rot ?? 0) * e); ctx.scale(1 + ((lf.s ?? 1) - 1) * e, 1 + ((lf.s ?? 1) - 1) * e); ctx.translate(-(wd.x + wd.wd / 2), -(wd.y - L.size * .35)); }
    // mask reveal left → right, with a press: the ink lands darker and a hair larger, then settles
    const m = eoutX(clamp(u / .8)), press = 1 - eout(clamp(u)); ctx.beginPath(); ctx.rect(wd.x - 6, wd.y - L.size, (wd.wd + 14) * m, L.size * 1.35); ctx.clip();
    ctx.globalAlpha = (st.alpha ?? 1);
    ctx.fillStyle = rgba('#ffffff', .35); ctx.fillText(wd.w, wd.x - .9, wd.y - .9);                 // the debossed light edge
    ctx.fillStyle = rgba(col, .92 + .08 * press); ctx.fillText(wd.w, wd.x, wd.y);
    ctx.fillStyle = rgba(col, .25 * press); ctx.fillText(wd.w, wd.x + .8, wd.y + .8);
    ctx.restore();
  });
  // hanging quote marks
  if ((o.marks ?? true) && n && o.quote && shown > 0) {
    const f = L.words[0], la = L.words[n - 1], a = clamp(shown * 2);
    ctx.save(); ctx.globalAlpha = .55 * a; ctx.fillStyle = rgba('#8a5a2a', 1); ctx.font = `${L.size * 1.3}px "Instrument Serif"`;
    ctx.fillText('“', f.x - L.size * .5, f.y + L.size * .05); if (shown >= n) ctx.fillText('”', la.x + la.wd + 4, la.y + L.size * .05); ctx.restore();
  }
  // the attribution (Inter caps) and a short rule above it
  const aAt = o.attribAt ?? t0 + n * per + .25, au = clamp((t - aAt) / .6);
  if (o.attrib && au > 0) {
    const e = eoutX(au); ctx.save(); ctx.strokeStyle = rgba('#8a5a2a', .7); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-40 * e, L.attrY - 40); ctx.lineTo(40 * e, L.attrY - 40); ctx.stroke();
    ctx.font = '600 21px "Inter"'; try { ctx.letterSpacing = '5px'; } catch { } const aw = ctx.measureText(o.attrib).width;
    ctx.beginPath(); ctx.rect(-aw / 2 - 10, L.attrY - 30, (aw + 20) * e, 44); ctx.clip(); ctx.fillStyle = rgba(CARD.inkSoft, .95); ctx.textAlign = 'center'; ctx.fillText(o.attrib, 0, L.attrY); ctx.restore();
  }
  if (o.note) { const nu = clamp((t - aAt - .5) / .6); if (nu > 0) { ctx.save(); ctx.font = '500 17px "Inter"'; try { ctx.letterSpacing = '2px'; } catch { } const nw = ctx.measureText(o.note).width; ctx.beginPath(); ctx.rect(-nw / 2 - 10, L.noteY - 24, (nw + 20) * eoutX(nu), 36); ctx.clip(); ctx.fillStyle = rgba(CARD.inkSoft, .8); ctx.textAlign = 'center'; ctx.fillText(o.note, 0, L.noteY); ctx.restore(); } }
  ctx.restore();
  const word = (k) => { const wd = typeof k === 'number' ? L.words[k] : L.words.find((q) => q.w.replace(/[^\w]/g, '') === String(k).replace(/[^\w]/g, '')); if (!wd) return null;
    const a = toScreen(wd.x, wd.y - L.size * .72), b = toScreen(wd.x + wd.wd, wd.y + L.size * .18); return { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1], local: { x: wd.x, y: wd.y - L.size * .72, w: wd.wd, h: L.size * .9 } }; };
  const a = toScreen(-cw, -ch);
  return { rect: { x: a[0], y: a[1], w: CARD.w * s, h: CARD.h * s }, word, words: L.words, toScreen, local: { size: L.size, attrY: L.attrY } };
}

// ---------------------------------------------------------------- the clip print
export function clipPrint(ctx, t, T, id, o = {}) {
  const c = T && T.clip ? T.clip(id) : null, x = o.x ?? 370, y = o.y ?? 150, w = o.w ?? 1180, h = o.h ?? 664, m = o.mat ?? 70, rot = o.rot ?? 0;
  const on = clamp(o.on ?? (c ? sm(lin(c.start - .6, c.start, t)) * (1 - sm(lin(c.end, c.end + .6, t))) : 1));
  const cx = x + w / 2, cy = y + h / 2;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.translate(-cx, -cy);
  // the dark mat: rough edges, a shadow, fibre texture, an engraved double plate mark around the picture
  const mat = rough([[x - m, y - m], [x + w + m, y - m], [x + w + m, y + h + m * 1.25], [x - m, y + h + m * 1.25]], 2.5, 11, { step: 16 });
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50; ctx.shadowOffsetX = 12; ctx.shadowOffsetY = 22; ctx.fillStyle = '#0b0c1e'; poly(ctx, mat); ctx.fill(); ctx.restore();
  ctx.save(); poly(ctx, mat); ctx.clip(); ctx.drawImage(matTex(), x - m - 10, y - m - 10, w + 2 * m + 20, h + 2.25 * m + 20); ctx.restore();
  ctx.strokeStyle = rgba('#9a92d0', .35); ctx.lineWidth = 1.2; poly(ctx, mat); ctx.stroke();
  for (const [ins, a] of [[-18, .45], [-26, .2]]) { ctx.strokeStyle = rgba('#b9b0e0', a); ctx.lineWidth = 1; ctx.strokeRect(x + ins, y + ins, w - 2 * ins, h - 2 * ins); }
  // the picture: dark (a faint latent image) until the light lands, then the clip
  ctx.fillStyle = '#05060f'; ctx.fillRect(x, y, w, h);
  const k = c ? Math.floor(clamp(t - c.start, 0, c.end - c.start) * 30) + 1 : 1, fr = clipFrame(id, k) || clipFrame(id, 1);
  if (fr) {
    const sc = Math.max(w / fr.width, h / fr.height), dw = fr.width * sc, dh = fr.height * sc;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.globalAlpha = .06 + .94 * on; ctx.drawImage(fr, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh); ctx.globalAlpha = 1;
    // the print finish of the picture: a faint vignette and warm corner light from the firefly
    if (w > 4 && h > 4 && isFinite(w + h + cx + cy)) { const vg = ctx.createRadialGradient(cx, cy, Math.min(w, h) * .35, cx, cy, Math.max(w, h) * .72); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, 'rgba(5,6,15,.45)'); ctx.fillStyle = vg; ctx.fillRect(x, y, w, h); }
    if (on < 1) { ctx.fillStyle = `rgba(5,6,15,${.82 * (1 - on)})`; ctx.fillRect(x, y, w, h); }
    ctx.restore();
  }
  ctx.strokeStyle = rgba('#e9dcb8', .25 + .25 * on); ctx.lineWidth = 1.4; ctx.strokeRect(x, y, w, h);
  ctx.restore();
  const corner = (o.corner || 'tr') === 'tr' ? [x + w - 6, y + 6] : o.corner === 'tl' ? [x + 6, y + 6] : o.corner === 'br' ? [x + w - 6, y + h - 6] : [x + 6, y + h - 6];
  // the corner light (the firefly's own light on the print)
  if ((o.glow ?? 1) > 0 && on > 0) { const gr = ctx.createRadialGradient(corner[0], corner[1], 0, corner[0], corner[1], 520); gr.addColorStop(0, rgba('#b9f0c8', .16 * on * (o.glow ?? 1))); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = gr; ctx.fillRect(corner[0] - 520, corner[1] - 520, 1040, 1040); ctx.restore(); }
  // lower third (above y 900): name · role, ORIGINAL FOOTAGE
  const lo = clamp(o.lower ?? (c ? sm(lin(c.start + .3, c.start + 1, t)) * (1 - sm(lin(c.end - .7, c.end - .1, t))) : 1));
  if (lo > 0) lowerPrint(ctx, t, { x: o.lowerX ?? 140, y: o.lowerY ?? 842, u: lo, name: o.name || 'Tom Blomfield', role: o.role || 'THEN PARTNER AT Y COMBINATOR', tag: o.tag === undefined ? 'ORIGINAL FOOTAGE' : o.tag });
  return { rect: { x, y, w, h }, corner, on };
}
// the lower third in print language: a fine gold rule drawn from the left, then the name (Instrument Serif) and the role (Inter caps)
// revealed by a mask, the ORIGINAL FOOTAGE tag in a thin rounded frame with a small amber light
export function lowerPrint(ctx, t, o = {}) {
  const x = o.x ?? 140, y = o.y ?? 842, u = clamp(o.u ?? 1), e = eoutX(u), name = o.name || '', role = o.role || '', tag = o.tag;
  ctx.save(); ctx.font = '42px "Instrument Serif"'; const nw = ctx.measureText(name).width; ctx.font = '600 18px "Inter"'; try { ctx.letterSpacing = '4px'; } catch { } const rw = ctx.measureText(role).width; ctx.restore();
  ctx.save(); ctx.font = '600 16px "Inter"'; try { ctx.letterSpacing = '3px'; } catch { } const tw = tag ? ctx.measureText(tag).width : 0; ctx.restore();
  const tagW = tag ? tw + 48 : 0, ww = Math.max(nw + (tag ? 30 + tagW : 0), rw) + 24;
  ctx.save(); ctx.strokeStyle = rgba('#f3d9a0', .8); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x, y + 48); ctx.lineTo(x + ww * e, y + 48); ctx.stroke(); ctx.restore();
  const tu = eoutX(clamp((u - .2) / .8)); if (tu <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 6, y - 50, (ww + 12) * tu, 120); ctx.clip();
  text(ctx, name, x, y, { size: 42, font: 'Instrument Serif', color: '#f3ecda' });
  text(ctx, role, x, y + 32, { size: 18, weight: 600, color: rgba('#e9dcc0', .85), spacing: 4 });
  if (tag) { const tx = x + nw + 30, cy = y - 13, ph = 32;
    ctx.strokeStyle = rgba('#f3ecda', .55); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.roundRect(tx, cy - ph / 2, tagW, ph, ph / 2); ctx.stroke();
    const pl = .75 + .25 * Math.sin(t * 3.2); ctx.fillStyle = rgba('#ffb35c', .95 * pl); ctx.beginPath(); ctx.arc(tx + 17, cy, 4.6, 0, TAU); ctx.fill();
    const gg = ctx.createRadialGradient(tx + 17, cy, 0, tx + 17, cy, 16); gg.addColorStop(0, rgba('#ffb35c', .35 * pl)); gg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gg; ctx.fillRect(tx + 1, cy - 16, 32, 32);
    text(ctx, tag, tx + 31, cy + 6, { size: 16, weight: 600, color: rgba('#f3ecda', .92), spacing: 3 }); }
  ctx.restore();
}
