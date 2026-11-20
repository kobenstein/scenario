// Quote card in the film's print look: the words light up with the voice, and name, role, source and date are always on screen.
//   quoteCard2(ctx, t, o)
//     o: { words: T.W(sec, from, to) (lit word by word with the VO) | text: '…' (static, lit at once),
//          name, role, source, date (all shown; Jakob's rule: attribution, year and percent on screen),
//          t0, t1 (card in / out; default: first word − .7 s, last word + 1.4 s), x, y (card centre, default 960, 520),
//          w (text width, 1080), size (52), paper: true (cream sheet on the scene, ink text) | false (cream text on a dark scene),
//          hi: ['word', …] (amber, and a foil underline when lit), rot (-.018), seed, mark: true (big amber “) }
//   Returns { lit } (0..1 how far the quote is spoken), e.g. to cue a carrier.
import { rgba, clamp, lin, mix, eout, sm, prng, text, canvas, addGlow } from '../engine.mjs';
import { paperSheet } from './paper.mjs';

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9%]/g, '');
const [, MX] = canvas(8, 8);
function layout(words, size, w) {
  MX.font = `${size}px "Instrument Serif"`; const sp = MX.measureText(' ').width, lines = [[]]; let x = 0;
  for (const wd of words) { const ww = MX.measureText(wd.w).width; if (x > 0 && x + ww > w) { lines.push([]); x = 0; } lines[lines.length - 1].push({ ...wd, x, ww }); x += ww + sp; }
  return lines.map((L) => ({ words: L, width: L.length ? L[L.length - 1].x + L[L.length - 1].ww : 0 }));
}
export function quoteCard2(ctx, t, o = {}) {
  const words = o.words || (o.text || '').split(/\s+/).filter(Boolean).map((w) => ({ w, s: o.t0 ?? 0, e: o.t0 ?? 0 }));
  if (!words.length) return { lit: 0 };
  const t0 = o.t0 ?? words[0].s - .7, t1 = o.t1 ?? words[words.length - 1].e + 1.4;
  const aIn = eout(lin(t0, t0 + .7, t)), aOut = 1 - sm(lin(t1, t1 + .5, t)), A = aIn * aOut; if (A <= 0) return { lit: 0 };
  const size = o.size ?? 52, tw = o.w ?? 1080, lh = size * 1.22, lines = layout(words, size, tw), paper = o.paper !== false;
  const hi = new Set((o.hi || []).map(norm)), ink = paper ? '#1f2a3a' : '#f3efe2', amber = paper ? '#b8661f' : '#ffb35c';
  const meta = [o.role, o.source, o.date].filter(Boolean).join('  ·  ').toUpperCase();
  MX.font = '600 15px Inter'; const metaW = MX.measureText(meta).width + meta.length * 2.5; MX.font = '32px "Instrument Serif"'; const nameW = o.name ? MX.measureText(o.name).width : 0;
  const textH = lines.length * lh, metaH = 84, padX = 90, padY = 80, cw = Math.max(640, ...lines.map((L) => L.width), metaW, nameW) + padX * 2, ch = textH + metaH + padY * 2;
  const x = o.x ?? 960, y = (o.y ?? 520) + (1 - aIn) * 40, rot = (o.rot ?? -.018) * (1 + (1 - aIn) * 2);
  ctx.save(); ctx.globalAlpha = A;
  if (paper) paperSheet(ctx, x - cw / 2, y - ch / 2, cw, ch, { rot, seed: o.seed ?? 11, lift: 10 + 20 * (1 - aIn), light: [x + cw * .3, y - ch] });
  ctx.translate(x, y); ctx.rotate(rot); ctx.translate(-cw / 2, -ch / 2);
  if (o.mark !== false) text(ctx, '“', padX - 64, padY + size * .95, { size: size * 2.6, font: 'Instrument Serif', color: rgba(amber, paper ? .8 : .9) });
  let spoken = 0;
  lines.forEach((L, li) => {
    const yy = padY + size + li * lh, ox = padX;
    for (const wd of L.words) {
      const lit = sm(lin(wd.s - .06, wd.s + .22, t)); spoken += lit / words.length;
      const isHi = hi.has(norm(wd.w)), col = isHi ? amber : ink;
      text(ctx, wd.w, ox + wd.x, yy, { size, font: 'Instrument Serif', color: rgba(col, mix(.2, 1, lit)) });
      if (isHi && lit > 0) { ctx.save(); ctx.strokeStyle = rgba(amber, .75 * lit); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ox + wd.x, yy + 9); ctx.lineTo(ox + wd.x + wd.ww * lit, yy + 9); ctx.stroke(); ctx.restore();
        if (!paper) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, ox + wd.x + wd.ww / 2, yy - size * .3, wd.ww * .8, .18 * lit, '#ffb35c', '#fff1d6'); ctx.restore(); } }
    }
  });
  // attribution: name in serif, role · source · date in small caps (always readable, never animated away)
  const my = padY + textH + 46;
  ctx.strokeStyle = rgba(amber, .7); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(padX, my - 26); ctx.lineTo(padX + 46, my - 26); ctx.stroke();
  if (o.name) text(ctx, o.name, padX, my + 8, { size: 32, font: 'Instrument Serif', color: rgba(ink, .95) });
  if (meta) text(ctx, meta, padX, my + 38, { size: 15, weight: 600, color: rgba(ink, .62), spacing: 2.5 });
  ctx.restore();
  return { lit: spoken };
}
