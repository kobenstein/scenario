// c10 · B3 · 'This channel exists' (p910) → 'One country has built' (p1011). Subscribe 1 and the first half of the answer.
// One continuous take, no cut inside: the question card folds down onto the line and becomes its warm light (the mission) → both sides of
// the door light up → the SUBSCRIBE tag rises out of the line and sinks back → the section closes, the table of the five rises (2017) →
// the guards walk in and sit down, the table widens under one lamp → Rushkoff's line (quote card) → the table clones along the line →
// the tables sink, two walls rise: the left one thickens, the right one stays thin, calm lanterns before it (p1011).
//
// | ID   | anchor (phrase)               | zeigt wörtlich                               | picture                                                                    | layer | carrier out |
// |------|-------------------------------|----------------------------------------------|----------------------------------------------------------------------------|-------|-------------|
// | M.01 | This channel exists           | the channel: superintelligence goes well for everybody | the question card folds onto the line, warm light runs along the whole line; the mission line rises in the sky | MIX | the hatch |
// | M.02 | On both sides of that door    | on both sides of that door                    | the hatch in section: gold light above it and in the room below            | MIX   | the line    |
// | M.03 | Want that too                 | want that too?                                | a cream SUBSCRIBE tag rises out of the line (a tag, never a button)         | MIX   | the tag     |
// | M.04 | Then subscribe                | then subscribe                                | the same tag, its underline draws                                           | MIX   | the line    |
// | 5.15 | Remember the answer           | the answer the five rolled their eyes at      | the section closes; the table of the five rises out of the line, small: 2017; the heads tip back (eye-roll) | MIX | the table |
// | 5.16 | Treat your guards like friends| treat your guards like friends                | two guards walk in and sit down at the same table, one shared lamp: LIKE FRIENDS | MIX | the lamp |
// | 5.17 | Right now                     | right now                                     | RIGHT NOW rises under the table                                             | EXPL  | the table   |
// | 5.18 | Invest, Rushkoff told them    | invest in people and relationships            | quote card Rushkoff (Survival of the Richest, 2018), "people and relationships" turn gold as spoken | EXPL | the card |
// | 5.19 | Scale that up                 | scale it up, it stops sounding soft           | the card folds away; the table clones along the line, six more tables       | EXPL  | the line    |
// | 5.20 | The best protection isn't     | not a thicker door                            | the tables sink; two walls rise; the left one grows thicker: A THICKER DOOR | EXPL  | the right wall |
// | 5.21 | It's a world nobody wants     | a world nobody wants to storm                 | the right wall stays thin; lantern people rise before it, calm: A WORLD NOBODY WANTS TO STORM (p1011) | EXPL | the wall |
import { E, F, S, X, LY, TAU, lab, view, seamKeys, keyed, tag, quote, tableScene, stage910, P910, PL910, p910, stage1011, P1011, PL1011, p1011 } from '../lib/b3_common.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, halo } = E;
const { GOLD, CREAM, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT72;
const TX = 960, TK = 1.2;   // the table (sheet x), its scale
const CLONES = [-1, 1, -2, 2, -3, 3].map((k) => k * 600);

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    ch: R.a, reason: G('one reason'), so: G('so that the'), every: G('everybody'), both: G('On both sides'), want: G('Want that too'), subs: G('Then subscribe'),
    remember: G('Remember the answer'), five: G('five men'), rolled: G('rolled their'), treat: G('Treat your guards'), guards: G('guards like'), friends: G('like friends'),
    now: G('Right now'), invest: G('Invest'), inP: G('in people'), people: G('people and'), and: G('and relationships'), rel: G('relationships'),
    scale: G('Scale that up'), soft: G('sounding soft'), best: G('The best protection'), thicker: G('thicker door'), world: G("It's a world"), storm: G('to storm'), end: R.b,
  };
  const tP = A.end - S.SEAM_HALF, tSwitch = A.best - .6;
  // ---------------------------------------------------------------- the view: calm, one path
  const VD = [...seamKeys(T, 'This channel exists', P910.V), [A.so + .4, { x: 960, y: 562, s: 1.03 }], [A.both + .6, { x: 960, y: 590, s: 1.07 }], [A.subs + .8, { x: 960, y: 560, s: 1.05 }],
    [A.remember + 1.1, { x: 960, y: 515, s: 1.08 }], [A.invest + .2, { x: 960, y: 505, s: 1.06 }], [A.soft, { x: 960, y: 520, s: .87 }], [A.best + .3, { x: 975, y: 525, s: .9 }], [A.thicker + .5, { x: 990, y: 528, s: .97 }], [tP, P1011.V]];
  const vw = (t) => view(t, VD);
  const POOL = [[A.ch, P910.pool], [A.remember + .8, [960, 430, .85]], [A.scale + 1, [960, 420, .9]], [A.best + .2, [960, 420, .85]], [A.world + .5, P1011.pool]];
  const pool = (t) => { let i = 0; while (i < POOL.length - 2 && t > POOL[i + 1][0]) i++; const [t0, a] = POOL[i], [t1, b] = POOL[i + 1], u = sineIO(span(t, t0, t1)); return a.map((x, j) => lerp(x, b[j], u)); };

  // ---------------------------------------------------------------- M.01–M.04 on the section stage (stage910)
  const foldU = (t) => span(t, A.ch + .65, A.ch + 1.55);
  const dropU = (t) => quartIO(span(t, A.ch + 1.0, A.reason + .2));
  const warm = (t) => span(t, A.reason + .05, A.so + 1.6) * (1 - .35 * span(t, A.remember - .4, A.remember + .5));
  const tagU = (t) => expoOut(span(t, A.want - .15, A.want + .6)) * (1 - sineIO(span(t, A.remember - .7, A.remember - .05)));
  const closeU = (t) => span(t, A.remember - .5, A.remember + .5);
  function sectionTop(ctx, t, s) {
    X.label(ctx, SRC.mission, TX, 300, lab(t, A.so - .1, A.both + .1), { size: 34, spacing: .12, gold: .35 });
    const tu = tagU(t); if (tu > 0) above(ctx, () => { ctx.save(); ctx.translate(0, (1 - tu) * (LY + 80 - 450)); tag(ctx, SRC.subscribe, TX, 450, 1, span(t, A.subs + .05, A.subs + .7) * span(tu, .9, 1)); ctx.restore(); });
  }

  // ---------------------------------------------------------------- 5.15–5.19 the table of the five
  const tableU = (t) => span(t, A.remember + .15, A.remember + 1.25);
  const guardX = (t, i) => { const w = span(t, A.treat - .9 + i * .15, A.guards + .35 + i * .1); return { dx: lerp(i ? -900 : 940, i ? -190 : 190, sineIO(w)), walk: w > 0 && w < 1 ? t * 5.6 + i : undefined, sit: sineIO(span(t, A.guards + .4 + i * .1, A.guards + .95 + i * .1)), dir: i ? 1 : -1 }; };
  const wide = (t) => lerp(1, 1.5, sineIO(span(t, A.guards + .1, A.friends + .4)));
  const roll = (t) => F.bump(t, A.rolled - .05, .9);
  const cloneU = (t, i) => quartIO(span(t, A.scale + .2 + i * .1, A.scale + 1.2 + i * .1));
  const sinkU = (t, i) => span(t, A.best - .55 + (3 - Math.floor(i / 2)) * .09, A.best + .25 + (3 - Math.floor(i / 2)) * .09);   // outside first
  function tables(ctx, t, s) {
    const u0 = tableU(t); if (u0 <= 0) return;
    const g = [0, 1].map((i) => guardX(t, i)), opt = { k: TK, s, wide: wide(t), lamp: wide(t), roll: roll(t), guards: g };
    // the clones (behind the first), then the first table
    CLONES.forEach((dx, i) => { const c = cloneU(t, i); if (c <= 0) return; tableScene(ctx, t, TX + dx * c, LY, { ...opt, roll: 0, u: 1 - sinkU(t, i + 1) }); });
    tableScene(ctx, t, TX, LY, { ...opt, u: u0 * (1 - sinkU(t, 0)) });
  }
  function tableScreen(ctx, t, v) {   // tags and labels in screen space (≥ 22 px)
    const [sx, sy] = X.toScreen(v, TX + 230, LY - 250 * TK);
    X.dateTag(ctx, SRC.y2017, sx, sy, lab(t, A.remember + .9, A.treat + .2));
    const [lx, ly] = X.toScreen(v, TX, LY + 62), [rx, ry] = X.toScreen(v, TX, LY + 118);
    X.label(ctx, SRC.friends, lx, ly, lab(t, A.friends - .15, A.scale + .2), { size: 32, spacing: .14, gold: .5 });
    X.label(ctx, SRC.rightNow, rx, ry, lab(t, A.now - .1, A.scale + .3), { size: 26, spacing: .16 });
    // the quote card: rises above the table, folds up to its top edge when the line scales up
    const qu = span(t, A.invest - .35, A.invest + .45), qf = sineIO(span(t, A.scale - .15, A.scale + .45));
    if (qu > 0 && qf < 1) { const y0 = 96; ctx.save(); ctx.translate(0, y0); ctx.scale(1, Math.max(.001, 1 - qf)); ctx.translate(0, -y0);
      quote(ctx, t, { text: SRC.rushkoff.text, credit: SRC.rushkoff.credit, u: qu, y: y0, w: 1180, size: 46, hi: [[8, A.invest], [9, A.inP], [10, A.people], [11, A.and], [12, A.rel]] }); ctx.restore(); }
  }

  // ---------------------------------------------------------------- 5.20–5.21 the walls (stage1011)
  const wallsU = (t) => span(t, A.best + .1, A.best + 1.0);
  const thickW = (t) => lerp(P1011.thin.w, P1011.thick.w, sineIO(span(t, A.thicker - .5, A.thicker + 1.0)));
  const rowU = (t) => span(t, A.world - .1, A.world + .9);

  function draw(ctx, t) {
    const v = vw(t), pl = pool(t);
    if (t < tSwitch) {
      const c = closeU(t);
      stage910(ctx, t, v, { ...PL910, pool: pl, card: 1, fold: foldU(t), cardY: lerp(P910.card.y, LY - 70, dropU(t)), warm: warm(t), cut: 1 - c, hatchSink: c, sinkRows: span(t, A.remember - .6 + 0, A.remember + .4),
        light: lerp(.45, 1, span(t, A.both - .1, A.both + .7)), above: span(t, A.both - .1, A.both + .7) * (1 - c), top: (cx, s) => { sectionTop(cx, t, s); tables(cx, t, s); } });
      tableScreen(ctx, t, v);
      return;
    }
    stage1011(ctx, t, v, { pool: pl, walls: wallsU(t), thickW: thickW(t), row: rowU(t), label1: lab(t, A.thicker - .3, A.world + .4), label2: span(t, A.world + .3, A.world + 1.0), top: (cx, s) => tables(cx, t, s) });
  }
  const above = (ctx, fn) => { ctx.save(); ctx.beginPath(); ctx.rect(-6000, -6000, 14000, 6000 + LY); ctx.clip(); fn(); ctx.restore(); };
  const marks = [R.a + S.SEAM_HALF, A.so, A.both, A.want, A.remember, A.treat, A.now, A.invest, A.scale, A.best, A.world];
  return [{ t: R.a, draw: (ctx, t) => p910(ctx, t, T), print: PR }, ...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => p1011(ctx, t, T), print: PR }];
};
