// C10 · Gravurschrift (shots.md §6): a sentence engraves itself into the sheet "The rule", word by word with the voice.
// Owner C10 (7.07–7.10). Pure function of t; text is drawn live (a few dozen words), nothing per-frame expensive.
//
//   engraveWords(ctx, words, x, y, o) → { front: [x, y] (the burin front on the baseline), w (full line width), done (0..1) }
//     words = T.W(seg, from, to) → [{ w, s, e }] (the voice's word times), x,y = left end of the baseline in the current transform.
//     o: { t, size 54, font 'Instrument Serif', ink '#1f2a3a', paper '#fbf3e1' (emboss highlight), lead .05 (s the cut starts before
//          the word), dur .3 (s to cut one word, longer words a little longer), hold [] (words that stay foil-amber longer, e.g. ['now,']),
//          holdFor 1.4 (s), glow 1 (warm glow on fresh words), tip true (burin tip at the cut front), base true (the dotted guide line under
//          the line turns solid behind the burin), baseW (px, default = line width + 40), a 1, spacing .4 (px) }
//   measureWords(ctx, words, o) → [{ x0, w }] positions of the words (same layout engraveWords uses)
import { rgba, clamp, lin, prng } from '../engine.mjs';
import { ghostLine, burinTip } from './ghost.mjs';

const font = (o) => `${o.size ?? 54}px "${o.font || 'Instrument Serif'}"`;
export function measureWords(ctx, words, o = {}) {
  ctx.save(); ctx.font = font(o); try { ctx.letterSpacing = (o.spacing ?? .4) + 'px'; } catch { }
  const sp = ctx.measureText(' ').width, out = []; let x = 0;
  for (const wd of words) { const w = ctx.measureText(wd.w).width; out.push({ x0: x, w }); x += w + sp; }
  ctx.restore(); return out;
}
export function engraveWords(ctx, words, x, y, o = {}) {
  const t = o.t ?? 0, size = o.size ?? 54, ink = o.ink || '#1f2a3a', a = o.a ?? 1, lead = o.lead ?? .05, hold = o.hold || [];
  const M = measureWords(ctx, words, o), total = M.length ? M[M.length - 1].x0 + M[M.length - 1].w : 0;
  let front = 0, frontY = y, cutting = false, done = 0;
  const uOf = (i) => { const wd = words[i], d = (o.dur ?? .3) * (.75 + .25 * Math.min(2, wd.w.length / 5)); return clamp((t - (wd.s - lead)) / d); };
  // the guide line: dotted ahead of the burin, engraved behind it
  for (let i = 0; i < words.length; i++) { const u = uOf(i); if (u > 0) { front = M[i].x0 + M[i].w * u; if (u < 1) cutting = true; done = (i + u) / words.length; } }
  if (o.base !== false) {
    const bw = o.baseW ?? total + 40, by = y + size * .2;
    ghostLine(ctx, [[x - 10, by], [x - 10 + bw, by]], { ghost: 1, burin: clamp((front + 10) / bw), col: rgba(ink, 1), w: 1, a: .32 * a, dot: 6, noTip: true, t });
  }
  ctx.save(); ctx.font = font(o); try { ctx.letterSpacing = (o.spacing ?? .4) + 'px'; } catch { } ctx.textBaseline = 'alphabetic';
  for (let i = 0; i < words.length; i++) {
    const u = uOf(i); if (u <= 0) continue;
    const wd = words[i], wx = x + M[i].x0, ww = M[i].w, age = t - (wd.s - lead) - (o.dur ?? .3), isHold = hold.includes(wd.w);
    ctx.save(); ctx.beginPath(); ctx.rect(wx - 4, y - size * 1.1, (ww + 8) * u, size * 1.6); ctx.clip();
    // intaglio: a paper-light lip below-right, the ink in the cut, a faint dark burr above-left
    ctx.globalAlpha = a * .55; ctx.fillStyle = o.paper || '#fbf3e1'; ctx.fillText(wd.w, wx + .9, y + 1.1);
    ctx.globalAlpha = a * .25; ctx.fillStyle = '#000000'; ctx.fillText(wd.w, wx - .6, y - .7);
    const warm = isHold ? clamp(1 - (age - (o.holdFor ?? 1.4)) / .8) : clamp(1 - age / .55);
    ctx.globalAlpha = a; ctx.fillStyle = ink; ctx.fillText(wd.w, wx, y);
    if (warm > 0 && (o.glow ?? 1) > 0) {   // fresh cut: the letters glow foil-amber, then settle into ink
      ctx.globalAlpha = a * warm * (o.glow ?? 1) * (isHold ? .95 : .75); ctx.fillStyle = isHold ? '#c8742c' : '#b8641e'; ctx.fillText(wd.w, wx, y);
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a * warm * .28 * (o.glow ?? 1); ctx.fillStyle = '#ffb35c';
      for (const [dx, dy] of [[-1.2, 0], [1.2, 0], [0, -1.2], [0, 1.2]]) ctx.fillText(wd.w, wx + dx, y + dy);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
  }
  ctx.restore();
  if (cutting && o.tip !== false) burinTip(ctx, x + front + 2, y - size * .18, -.05, t, { size: Math.max(8, size * .2), a: a * .95, seed: 7 });
  return { front: [x + front, frontY], w: total, done };
}
