// c02 · B1 · Mark 1: the people who built it · Fermat as the proof tape out of the gap, every row ticked · ★ the calendar tower:
// YEARS (as tall as the door) → 11 DAYS → 30 HOURS · the numbers are its own; the first proof is public (a cyan check runs down
// the tape) · the machine that wrote it: the leak narrows, "AN INTERNAL RESEARCH MODEL".
// 'At the very front stand' → 'A second lab'. Part of ONE take c02–c06 (lib/f55_b1_take.mjs: anchors, the camera, the world);
// this file draws the explainers of 1.01–1.05. Plan: docs/shots.md.
//
// | ID    | anchor (phrase)              | picture (one idea)                                                            | camera                 |
// |-------|------------------------------|-------------------------------------------------------------------------------|------------------------|
// | 1.01  | At the very front stand      | out of plateLine: push along the line to mark 1, the lab coats look up; THE LAB| push · LINE            |
// | 1.02  | There, machines have written | the proof tape out of the gap, rows write and tick; FERMAT'S LAST THEOREM ·   | truck to the gap · EXPL|
// |       |                              | COMPUTER-CHECKED                                                              |                        |
// | 1.03★ | That work was expected       | a pad of calendar sheets grows from the floor as tall as the door (YEARS),    | pull back, follow the  |
// |       |                              | collapses to 11 (11 DAYS), then to one (30 HOURS); source fermat (47 LEMMAS)  | top down · EXPL        |
// | 1.04  | The lab is Anthropic         | ANTHROPIC over the door; THE NUMBERS ARE ITS OWN; PROOF PUBLIC, a cyan check  | back to the door · MIX |
// |       |                              | runs down the tape; source buzzard                                            |                        |
// | 1.05  | And the machine that wrote it| the leak narrows; "AN INTERNAL RESEARCH MODEL"                                | slow pull · MIX        |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f55_kit.mjs';
import * as S from '../lib/f55_seams.mjs';
import { entry, say, win, STACK, tower } from '../lib/f55_b1_take.mjs';
const { P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex } = E;
const { rise, GOLD, CHECK } = F;

export default entry;

// the proof tape hangs out of door 1's gap; its size follows the door (screen px), so it belongs to the door at any distance
export function tapeRect(c, kw = .3) {
  const g = S.gapRect(c), d = S.doorRect(c); if (!g || !d) return null;
  const w = Math.max(60, Math.min(d.h * kw, 320 * kw / .3)), x = g.x - w - d.h * .03, y = Math.max(96, d.y + d.h * .1), len = Math.min(d.h * .63, 840 - y);
  return { x, y, w, len, g, d };
}

// the tower's flights: the top sheet (and a few behind it) tears off and flies away left when the pad collapses
const FLIGHTS = (a) => [
  { t0: a.eleven - .12, from: 60, top: 'YEARS', sub: 'EXPECTED', n: 5 },
  { t0: a.thirty - .12, from: 11, top: '11', sub: 'DAYS', n: 3 },
  { t0: a.labIs + .3, from: 1.5, top: '30', sub: 'HOURS', n: 1 },
];
function towerN(a, t) {
  const grow = 60 * sineIO(span(t, a.expected + .1, a.years + .9));
  if (t < a.eleven - .12) return grow;
  if (t < a.thirty - .12) return lerp(60, 11, expoOut(span(t, a.eleven - .12, a.eleven + .55)));
  if (t < a.labIs + .3) return lerp(11, 1.5, expoOut(span(t, a.thirty - .12, a.thirty + .5)));
  return t < a.labIs + .32 ? 1.5 : 0;
}
export function floor(ctx, t, X) {
  const { a, c } = X; if (t < a.expected || t > a.labIs + 2.2) return;
  const n = towerN(a, t), lab = t < a.eleven - .12 ? ['YEARS', 'EXPECTED'] : t < a.thirty - .12 ? ['11', 'DAYS'] : ['30', 'HOURS'];
  S.at(ctx, c, STACK.x, STACK.z, () => {
    const s = STACK.s, th = STACK.th, k = sineIO(span(t, a.expected + .05, a.expected + .9));   // the first sheet rises out of the floor
    if (k < 1) { ctx.save(); ctx.beginPath(); ctx.rect(-s * 4, -s * 8, s * 8, s * 8); ctx.clip(); ctx.translate(0, (1 - k) * s * 1.2); tower(ctx, t, n, lab[0], lab[1]); ctx.restore(); }
    else tower(ctx, t, n, lab[0], lab[1]);
    for (const fl of FLIGHTS(a)) {
      const e0 = span(t, fl.t0, fl.t0 + 1.5); if (e0 <= 0 || e0 >= 1) continue;
      const y0 = -(s * 1.12 + (Math.min(60, fl.from) - 1) * th);
      for (let j = fl.n - 1; j >= 0; j--) {
        const e = clamp(e0 * (1 + j * .12) - j * .05); if (e <= 0) continue;
        const x = -s * (5.5 + j * .8) * e * e - s * .25 * Math.sin(e * 3), y = y0 + j * th * 3 + s * (.6 + j * .1) * e + s * 2.2 * e * e;
        ctx.save(); ctx.translate(x, y); ctx.rotate(-(1.1 + j * .35) * e * e - .15 * Math.sin(e * 5));
        F.calSheet(ctx, t, 0, 0, s, j === 0 ? fl.top : '', j === 0 ? fl.sub : '', { a: 1 - span(e, .45, .8) });
        ctx.restore();
      }
    }
  });
}

export function over(ctx, t, X) {
  const { a, c } = X;
  // ---- 1.01 THE LAB: a label pinned to mark 1
  const lu = rise(span(t, a.T0 + 1.3, a.T0 + 2.3)) * (1 - sineIO(span(t, a.there - .2, a.there + .5)));
  if (lu > 0) { const m = S.markPt(0), p = S.proj(c, m.x + 40, 0, m.z); if (p) F.label(ctx, p[0], p[1] - 6, 'THE LAB', null, lu, { dx: 70, dy: -150, size: 44, col: GOLD }); }
  // ---- 1.02 / 1.04 the proof tape out of the gap; it rolls back in as the camera leaves for the second door
  const tu = expoOut(span(t, a.fermat - .9, a.fermat + .5)) * (1 - sineIO(span(t, a.second + .4, a.second + 1.5)));
  if (tu > 0) {
    const r = tapeRect(c);
    if (r && r.x + r.w > -20 && r.x < E.W + 20) {
      const pitch = r.w * .17, vis = r.len / pitch, rows = Math.min(vis - .4, Math.max(0, (t - a.fermat + .6) * 2.6));
      const ticks = Math.min(rows, Math.max(0, (t - a.computer + .3) * 6));
      const flow = 0;
      F.proofTape(ctx, t, r.x, r.y, r.w, r.len * tu, { rows, ticks, roll: true, seed: 7, pitch, flow });
      // 1.04 anyone can run the check: a cyan line runs down the tape
      const su = span(t, a.anyone - .3, a.checkE + .5);
      if (su > 0 && su < 1) { const y = r.y + r.len * tu * sineIO(su); F.accentSpan(ctx, [[r.x - 10, y], [r.x + r.w + 10, y]], 0, 1, { w: 2.2, spark: false, a: Math.sin(Math.PI * su) }); }
    }
  }
  F.veil(ctx, (.17 * sineIO(span(t, a.T0 + 1.0, a.there)) + .22 * sineIO(span(t, a.fermat - 1.4, a.fermat))) * (1 - sineIO(span(t, a.labIs + .6, a.labIs + 2.4))));   // integration: c02 luma 63.4 → ≤ 60 (stronger, earlier)   // luma: the cream tape and the pad are big here
  // ---- 1.02 FERMAT'S LAST THEOREM · COMPUTER-CHECKED
  const fOut = a.expected + .3;
  say(ctx, "FERMAT'S LAST THEOREM", 120, 300, 88, win(t, a.fermat - .15, fOut), { serif: true });
  say(ctx, 'COMPUTER-CHECKED', 124, 400, 62, win(t, a.computer, fOut), { col: CHECK.text });
  // ---- 1.03 ★ 11 DAYS → 30 HOURS (the pad says YEARS itself)
  const dOut = a.labIs + .4;
  say(ctx, '11 DAYS', 120, 290, 132, win(t, a.eleven + .55, dOut), { serif: true });
  const au = win(t, a.thirty - .25, dOut);
  if (au > 0) { ctx.save(); F.screenFloat(ctx, t, 1); const y = 392, x0 = 128, k = expoOut(au); F.accentSpan(ctx, [[x0, y], [x0 + 70 * k, y]], 0, 1, { col: GOLD, w: 3, spark: false, a: au }); if (k > .6) { ctx.strokeStyle = rgba(GOLD.core, au); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0 + 70 * k - 20, y - 18); ctx.lineTo(x0 + 70 * k, y); ctx.lineTo(x0 + 70 * k - 20, y + 18); ctx.stroke(); } ctx.restore(); }
  say(ctx, '30 HOURS', 236, 440, 132, win(t, a.thirty - .1, dOut), { serif: true, col: GOLD.text });
  F.source(ctx, t, a.eleven + .3, a.labIs + 1.2, F.SOURCES.fermat);
  // ---- 1.04 THE NUMBERS ARE ITS OWN · PROOF PUBLIC
  say(ctx, [['THE NUMBERS ARE ', 0], ['ITS OWN', 1]], 120, 300, 80, win(t, a.numbers - .1, a.public - .15), { acc: GOLD });
  say(ctx, 'PROOF PUBLIC.', 120, 320, 112, win(t, a.public, a.machine + .2), { col: CHECK.text });
  F.source(ctx, t, a.public + .5, a.machine + .5, F.SOURCES.buzzard);
  // ---- 1.05 "AN INTERNAL RESEARCH MODEL"
  const iu = win(t, a.internal - .15, a.second + 1.1, .5, .6);
  say(ctx, '“AN INTERNAL', 120, 290, 104, iu, { serif: true });
  say(ctx, 'RESEARCH MODEL”', 120, 395, 104, win(t, a.internal + .1, a.second + 1.1, .5, .6), { serif: true });
  say(ctx, 'ANTHROPIC', 124, 450, 24, win(t, a.internal + .4, a.second + 1.0), { col: P.halo2, glow: false });
}
