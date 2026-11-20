// c04 · B1 · Two things hold up: the clipboard returns, two ticks REAL MATHEMATICS · ONE HELD BACK (source line OPENAI CFO SARAH
// FRIAR · CNBC, NOV 6, 2026; vo-v4: no quote card) · both doors like shop windows: an announcement unrolls beside each door, a band of
// it is covered: ANNOUNCED. NOT AVAILABLE. · the shop shelf (the counter) with one empty place, the sign BEST lowered over it.
// 'Still, two things' → 'Ask either lab'. Part of ONE take c02–c06 (lib/f55_b1_take.mjs). Plan: docs/shots.md 1.10–1.13.
// (The BEST sign and the empty place are drawn with the counter in sc03.mjs.)
//
// | ID    | anchor (phrase)              | picture (one idea)                                                            | camera                 |
// |-------|------------------------------|-------------------------------------------------------------------------------|------------------------|
// | 1.10  | Still, two things            | the clipboard rises again: REAL MATHEMATICS ✓ · ONE HELD BACK ✓               | creep · EXPL           |
// | 1.11  | Its finance chief said so    | the tick ONE HELD BACK gets its source line (F.SOURCES.friar)                 | creep · EXPL           |
// | 1.12  | So the best A.I. is not hidden | posters unroll beside both doors, a band covers part; ANNOUNCED. NOT AVAILABLE. | tilt down · MIX   |
// | 1.13  | But a lab lives from selling | push to the counter: the shelf, one empty place, BEST lowered over it         | push · EXPL            |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f55_kit.mjs';
import { entry, say, win, D, D2 } from '../lib/f55_b1_take.mjs';
import { board } from './sc03.mjs';
const { H, P, rgba, lerp, span, sineIO, expoOut, expoIn, mixHex } = E;
const { rise, GOLD, CHECK } = F;

export default entry;

// 1.12 the announcements: a poster on the wall beside each door (wall-local world units), it unrolls from the top; a dark band covers part
const POSTERS = [{ x: 3150, k: 0 }, { x: D2.x - D.x + D2.w / 2 + 1950, k: 1 }];
export function wall(ctx, t, X) {
  const { a } = X; if (t < a.notHidden || t > a.why + 1.5) return;
  for (const p of POSTERS) {
    if (p.k === 1 && !X.d2) continue;
    const u = sineIO(span(t, a.notHidden + .3 + p.k * .35, a.notHidden + 1.4 + p.k * .35)) * (1 - sineIO(span(t, a.lives + p.k * .2, a.lives + 1.2 + p.k * .2))), s = 1800, h = s * 1.3, top = -4300;
    if (u <= 0) continue;
    ctx.save(); ctx.beginPath(); ctx.rect(p.x - s, top - 60, s * 2, 60 + h * u + 40); ctx.clip();
    F.docSheet(ctx, t, p.x, top, s, { lines: 6, seed: 3 + p.k });
    F.core(ctx, t, p.x + s * .3, top + s * .22, s * .22, { glow: .5 });
    const bu = expoOut(span(t, a.evidence - .1 + p.k * .2, a.evidence + .7 + p.k * .2));
    if (bu > 0) { ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(p.x - s * .46, top + s * .62, s * .92 * bu, s * .34); }
    ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(p.x - s * .5, top - 30, s, 30);   // the rail it hangs from
    ctx.restore();
  }
}

export function over(ctx, t, X) {
  const { a } = X;
  // ---- 1.10 the clipboard: two ticks
  const bu = sineIO(span(t, a.real - 1.6, a.real - .4)) * (1 - sineIO(span(t, a.notHidden - .6, a.notHidden + .6)));
  if (bu > 0) board(ctx, t, 110, lerp(H + 40, 240, bu), 700, [
    { text: 'REAL MATHEMATICS', u: rise(span(t, a.real - .2, a.real + .4)), tick: sineIO(span(t, a.real + .3, a.real + .9)) },
    { text: 'ONE HELD BACK', u: rise(span(t, a.holding - .2, a.holding + .4)), tick: sineIO(span(t, a.holding + .4, a.holding + 1)), col: mixHex(GOLD.deep, P.night1, .3) },
  ]);
  // ---- 1.11 its source (no card since vo-v4)
  F.source(ctx, t, a.finance - .1, a.notHidden + .3, F.SOURCES.friar);
  // ---- 1.12 ANNOUNCED. NOT AVAILABLE. (below the doors, above the subtitles)
  say(ctx, 'ANNOUNCED.', 150, 830, 92, win(t, a.announced - .1, a.lives + .1, .5, .6));
  say(ctx, 'NOT AVAILABLE.', 1770, 830, 92, win(t, a.access - .1, a.lives + .1, .5, .6), { align: 'right' });
}
