// c03 · The bell far right glints; the COUNTDOWN board is carried from that glint into the top-left corner (STEP 1 · THE PITCH) · the
// PROSPECTUS returns, thick · 90+ pages of risk factors (gold tabs) · two warning cards slide out of its edge · they go back, a gold-edged
// page: EXTRAORDINARY POTENTIAL / IF THE RISKS ARE MANAGED · "Managed by whom?": a gold ? rises.
// T.G('So before the opening bell') → T.G('With most companies') · builder B1. Part of the one B1 take (hub: scenes/sc02.mjs).
//
// | ID   | anchor (phrase)              | picture (one idea)                                                                | camera / layer   | carrier → next |
// |------|------------------------------|-----------------------------------------------------------------------------------|------------------|----------------|
// | 2.01 | So before the opening bell   | the camera trucks right along the parapet to the bell; it glints; a spark flies from the glint to the top left and the board unrolls behind it (STEP 1) | truck · MIX | the board |
// | 2.02 | The sales document           | the PROSPECTUS rises (it sank there at the end of the hook); it grows thick on "thick" | creep · MIX   | its edge       |
// | 2.03 | More than ninety             | gold tabs slide out of its edge: 90+ PAGES OF RISK FACTORS                         | creep · EXPL     | the tabs       |
// | 2.04 | The company writes that its  | the document slides left; two warning cards slide out of its edge (verbatim, risk factors) | creep · EXPL | the cards |
// | 2.05 | The promise is in there too  | the cards slide back in; a gold-edged page: EXTRAORDINARY POTENTIAL / IF THE RISKS ARE MANAGED; "Managed by whom?": a gold ? | creep · EXPL | the ? |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f59_kit.mjs';
import * as S from '../lib/f59_world.mjs';
import { b1, PRINT, CB, CC, line, gline } from './sc02.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo } = E;
const { rise, GOLD, PAPER } = F;

export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b1(T), print: PRINT }]; };

export const DOC = { s: 400, y: 190, xc: 760, xl: 300 };      // the prospectus: cover width, top, centred x, left x (cards beside it)
export function part03(T) {
  const A0 = T.G('So before the opening bell'), G = (p) => T.G(p, 0, A0 - .2), GE = (p) => T.GE(p, 0, A0 - .2);
  const a = {
    bell: G('opening bell'), worth: G("it's worth knowing"), sales: G('The sales document'), thick: G('is thick'), ninety: G('More than ninety'),
    warnings: GE('are warnings'), company: G('The company writes that its'), behaved: G('have behaved differently'), andthat: G('And that some have shown'),
    attempts: G('attempts to resist'), promise: G('The promise is in there too'), extra: G('extraordinary potential'), ifr: G('if the risks are managed'),
    managed: G('Managed by whom'), next: T.G('With most companies'),
  };
  const tGlint = a.bell + .5, tRev = tGlint + .55;
  const keys = [
    [a.bell + .6, CB(3850, 250, .62, 1250, 470)], [a.company, CB(3750, 280, .66, 1180, 470)],
    [a.promise + 2, CC(2600, 420, .8, 980, 500)], [a.next - .4, CC(2300, 400, .82, 960, 490)],
  ];
  // ---------------------------------------------------------------- the bell glints; a spark carries the board to the top left
  const glint = (t) => F.bump(t, tGlint - .25, .9);
  function spark(ctx, t, c) {
    const u = span(t, tGlint, tRev + .25); if (u <= 0 || u >= 1) return;
    const p = E.project(c, S.Z_BELL, S.BELL.x, S.BELL.y + S.BELL.s * .98); if (!p) return;
    const end = [78, 92], k = sineIO(u), pts = [];
    for (let i = 0; i <= 16; i++) { const q = Math.max(0, k - .25) + (k - Math.max(0, k - .25)) * i / 16; pts.push([lerp(p[0], end[0], q), lerp(p[1], end[1], q) - 260 * Math.sin(Math.PI * q)]); }
    F.goldSpan(ctx, pts, 0, 1, { w: 2, a: 1 - span(u, .85, 1) });
  }
  function board(ctx, t) {
    const rv = span(t, tRev, tRev + .8); if (rv <= 0) return;
    if (rv >= 1) { F.board(ctx, t, T); return; }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(0, 0, 62 + 560 * expoOut(rv), 280); ctx.clip(); F.board(ctx, t, T); ctx.restore();
  }
  // ---------------------------------------------------------------- the prospectus
  const docIn = (t) => sineIO(span(t, a.sales - .4, a.sales + 1.5)), docOut = (t) => sineIO(span(t, a.next - .2, a.next + 1.7));
  const docL = (t) => sineIO(span(t, a.company - .3, a.company + 1.6));
  const docX = (t) => lerp(DOC.xc - DOC.s / 2, DOC.xl, docL(t));
  const thick = (t) => .3 + .7 * expoOut(span(t, a.thick - .1, a.thick + .9));
  const tabs = (t) => span(t, a.ninety - .2, a.ninety + 1.6);
  function doc(ctx, t) {
    const i = docIn(t), o = docOut(t); if (i <= 0 || o >= 1) return;
    ctx.save(); F.float(ctx, t, 1); ctx.translate(0, (1 - i) * 900 + o * 900);
    F.prospectus(ctx, t, docX(t), DOC.y, DOC.s, { u: 1, thick: thick(t), tabs: tabs(t), cover: 'PROSPECTUS', sub: 'FORM S-1' });
    ctx.restore();
    // 90+ PAGES OF RISK FACTORS (right of the document; sinks when the document moves left)
    const lu = span(t, a.ninety, a.ninety + .8) * (1 - span(t, a.company - .4, a.company + .2));
    if (lu > 0) { ctx.save(); F.float(ctx, t, 1); gline(ctx, '90+', 1230, 470, 170, lu); line(ctx, 'PAGES OF RISK FACTORS', 1240, 540, 34, span(lu, .3, 1)); ctx.restore(); }
  }
  // ---------------------------------------------------------------- the warning cards: slide out of the document's right edge (and back)
  const CARDS = [
    { text: '“…behaving differently when they detect or infer that they are being evaluated”', y: 190, t0: () => a.behaved - .5 },
    { text: '“…attempts to resist shutdown”', y: 500, t0: () => a.andthat + .2 },
  ];
  function cards(ctx, t) {
    const back = sineIO(span(t, a.promise - .4, a.promise + 1.0));
    CARDS.forEach((cd, i) => {
      const tu = sineIO(span(t, cd.t0(), cd.t0() + 1.1)), u = tu * (1 - span(back, i ? 0 : .2, i ? .8 : 1)); if (u <= 0) return;
      const edge = docX(t) + DOC.s + 12, x1 = 760, w = 1040;
      ctx.save(); F.float(ctx, t, 1);
      ctx.beginPath(); ctx.rect(edge, 0, W, H); ctx.clip();
      F.quoteCard(ctx, t, T, { text: cd.text, x: lerp(edge - w, x1, u), y: cd.y, w, size: 46, head: 'RISK FACTORS', credit: F.SOURCES.riskFactors, u: lerp(.34, 1, span(tu, .5, 1)) });
      ctx.restore();
    });
  }
  // ---------------------------------------------------------------- the promise: a gold-edged page, then a gold ?
  const PG = { x: 760, y: 250, w: 1000, h: 300 };
  function page(ctx, t) {
    const u = sineIO(span(t, a.promise + .3, a.promise + 1.5)), o = docOut(t); if (u <= 0 || o >= 1) return;
    const edge = docX(t) + DOC.s + 12;
    ctx.save(); F.float(ctx, t, 1); ctx.translate(0, o * 900); ctx.beginPath(); ctx.rect(edge, 0, W, H + 900); ctx.clip();   // it sinks with the document
    const x = lerp(edge - PG.w, PG.x, u), cu = .34 + .66 * span(u, .5, 1);
    F.paperCard(ctx, t, x, PG.y, PG.w, PG.h, { u: cu, head: 'THE PROMISE', lines: [] });
    ctx.strokeStyle = rgba(GOLD.line, .95); ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x - 1, PG.y - 1 + (1 - expoOut(cu)) * 40, PG.w + 2, PG.h + 2, 7); ctx.stroke();
    gline(ctx, 'EXTRAORDINARY POTENTIAL', x + 40, PG.y + 160, 70, span(t, a.extra - .1, a.extra + .7), { col: PAPER.ink, gold: .85 });
    line(ctx, 'IF THE RISKS ARE MANAGED', x + 42, PG.y + 240, 40, span(t, a.ifr - .1, a.ifr + .7), { serif: true, col: PAPER.ink });
    ctx.restore();
  }
  // the ? (carried into c04: it becomes the answer, a vote)
  return {
    keys, a, board,
    world: (t, st) => {
      const g = glint(t);
      if (g > 0) st.bell = { swing: .015 * Math.sin(t * .5) + .05 * g * Math.sin((t - tGlint) * 7) * (1 - span(t, tGlint, tGlint + .9)) };
    },
    veil: (t) => .82 * docIn(t) * (1 - span(t, a.next + 1.0, a.next + 2.0)),   // c04 holds the veil from there
    over: (ctx, t, c) => {
      const g = glint(t);
      if (g > 0) { const p = E.project(c, S.Z_BELL, S.BELL.x, S.BELL.y + S.BELL.s * .98); if (p) { halo(ctx, p[0], p[1], 220 * p[2], .55 * g, GOLD.halo, GOLD.core); E.rays(ctx, p[0], p[1], 40 * p[2], 160 * p[2], 14, .35 * g, t * .2); } }
      spark(ctx, t, c); cards(ctx, t); doc(ctx, t); page(ctx, t);
    },
  };
}
