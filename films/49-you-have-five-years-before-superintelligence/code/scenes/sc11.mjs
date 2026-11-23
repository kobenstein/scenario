// Film 49 · c11 · DAWN · THE LANDING (B3). The same take (shared base in sc09.mjs).
//
// | beat  | phrase (VO)                          | picture                                                                                   | camera / kind     |
// |-------|--------------------------------------|-------------------------------------------------------------------------------------------|-------------------|
// | S.01★ | And there may be a great deal …      | DAWN (thumbnail A, once): a warm band low in the sky, the top of a disc rises; the law    | pull back · EXPL  |
// |       | nine in ten of the staff …           | table folds into its tread. Out of the door grows a lab card: SURVEY · NOBEL-LEVEL         |                   |
// |       |                                      | DISCOVERY BY 2030; ten figures, nine raise an arm; 91 % OF STAFF · U.S. ADULTS: 39 %       |                   |
// | S.02  | They have a stake in that            | the arms go down; the card goes back into the door                                          | hold · MIX        |
// | S.03  | But if even part … not only risks    | along the stairs the lights come on, stage by stage (each set pops up again)               | drift · MIX       |
// | S.04  | So suppose all of it works …         | the counter at the top (all five, a door of light); you leave the booth, step onto the    | glide · MIX       |
// |       | That leaves the hardest question     | landing, walk past the door; a small table unfolds on the landing (the place card on it);  |                   |
// |       |                                      | two guests come from the right: a neighbour and a child                                    |                   |
// Carriers: the dawn light · the door (the card comes from it and goes back) · the stage lights · you · the small table.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
import { b3, Y4, YL, LAW, BOOTH_X, YOU_TOP, TOP, figure, flipAt, lawTable, placeOnTop, veilL, grow, paperBox } from './sc09.mjs';
import { shareCaption } from './sc10.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, mixHex, P, W, H, halo } = E;
const { GOLD, COOL, PAPER } = F;

export default async (T, R) => {
  const B = b3(T);
  return [{ t: R.a, draw: scene(B, T), print: F.PRINT49 }];
};

// ---------------------------------------------------------------------------------------------------------------- shared with c12
// the small table on the landing: it unfolds out of the landing (pop-up book) on 'So suppose' — then it is st.topTable (= the end screen)
export const tablePop = (t, a) => span(t, a.suppose + 1.5, a.suppose + 2.7);
export const TABLE_FEET = TOP.y + 74;
export function tableUnfolding(ctx, t, k) {   // only while it unfolds (k < 1): the same table, scaled up out of its feet; the place card with it
  if (k <= 0) return;
  const e = expoOut(k);
  ctx.save(); ctx.translate(0, TABLE_FEET); ctx.scale(1, e); ctx.translate(0, -TABLE_FEET);
  S.weddingTable(ctx, t, TOP.x0, TOP.x1, TOP.y, { a: 1, lights: 0 });
  ctx.restore();
  ctx.save(); ctx.translate(0, TOP.y); ctx.scale(1, expoOut(span(k, .5, 1))); ctx.translate(0, -TOP.y); placeOnTop(ctx, t, {}); ctx.restore();
}
// the two guests: a neighbour and a child; they come from the right on the landing (behind the table) and sit down
export const SEAT = { n: 2130, c: 2240 };
export function neighbour(t, a) {
  const t0 = a.leaves - 1.2, w = span(t, t0, a.five + .5), sit = span(t, a.five + .5, a.five + 1.1);
  if (t < t0) return null;
  const h = 162;
  if (w < 1) return { x: lerp(2720, SEAT.n, w), y: YL, h, o: { walk: w * 34, dir: -1, light: .8 } };
  const y = lerp(YL, YL + 22, smooth(sit));
  const turn1 = a.five + 1.0, turn2 = a.stranger + .1;
  if (t < turn1) return { x: SEAT.n, y, h, o: { dir: -1, light: .8 } };
  if (t < turn2) return { x: SEAT.n, y, h, flip: flipAt(t, turn1, .5, -1), o: { light: .8, look: .1 } };
  return { x: SEAT.n, y, h, flip: flipAt(t, turn2, .5, 1), o: { light: .8, look: .15 } };
}
export function child(t, a) {
  const t0 = a.leaves - .9, w = span(t, t0, a.five + .9), up = span(t, a.five + .9, a.five + 1.4);
  if (t < t0) return null;
  const h = 100;
  if (w < 1) return { x: lerp(2780, SEAT.c, w), y: YL, h, o: { walk: w * 44, dir: -1, light: .8 } };
  const draw = smooth(span(t, a.five + 1.6, a.five + 2.4)), push = F.bump(t, a.loss + .6, .9);
  const s2 = 1.6 + .09 * Math.sin(t * 7.3) * draw * (1 - push);
  return { x: SEAT.c, y: lerp(YL, YL - 18, smooth(up)), h, o: { dir: -1, light: .8, look: -.2 * draw + .3 * push, armR: [lerp(.2, lerp(1.2, 1.45, push), draw), lerp(.1, lerp(s2, 1.5, push), draw)], lean: .15 * draw } };
}
// a guest behind the table: everything but the table's front (cloth + legs) is visible
export function seated(ctx, p, kind = 'person') {
  if (!p) return null;
  ctx.save(); ctx.beginPath(); ctx.rect(-1e4, -1e4, 2e4, 2e4); ctx.rect(TOP.x0 - 22, TOP.y, TOP.x1 - TOP.x0 + 44, TABLE_FEET - TOP.y + 2); ctx.clip('evenodd');
  const hd = figure(ctx, p, kind); ctx.restore(); return hd;
}

// ---------------------------------------------------------------------------------------------------------------- you in c11
export function you11(t, a) {
  const t0 = a.suppose + .5, w1 = span(t, t0, t0 + .8), up = span(t, t0 + .8, t0 + 1.1), w2 = span(t, t0 + 1.1, t0 + 3.9);
  if (t < t0) return { x: BOOTH_X, y: Y4, o: { dir: 1, back: .3, look: .55 + .25 * smooth(span(t, a.great, a.great + 2.5)) * (1 - smooth(span(t, a.even, a.even + 2))) } };
  if (w1 < 1) return { x: lerp(BOOTH_X, 1745, w1), y: Y4, o: { walk: w1 * 4, dir: 1, back: .3 } };
  if (up < 1) return { x: lerp(1745, 1772, up), y: lerp(Y4, YL, smooth(up)), o: { walk: 4 + up * 1.5, dir: 1, back: .25 } };
  if (w2 < 1) return { x: lerp(1772, YOU_TOP, sineIO(w2)), y: YL, o: { walk: 5.5 + w2 * 13, dir: 1, back: .2 } };
  return { x: YOU_TOP, y: YL, o: { dir: 1, back: .3, look: .3 - .5 * smooth(span(t, a.leaves, a.leaves + 1.2)) } };
}

// ---------------------------------------------------------------------------------------------------------------- the lab card (S.01)
const LAB = { x: 110, y: 190, w: 800, h: 470 };
function labCard(ctx, t, a, e) {
  paperBox(ctx, LAB, -.004, true);
  if (e < .7) return;
  const v = span(e, .7, 1);
  ctx.save(); ctx.translate(LAB.x + LAB.w / 2, LAB.y + LAB.h / 2); ctx.rotate(-.004); ctx.translate(-LAB.w / 2, -LAB.h / 2); ctx.globalAlpha *= v;
  const kc = PAPER.shade; ctx.fillStyle = rgba(kc, .16); ctx.strokeStyle = rgba(kc, .9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(34, 30, 128, 36, 18); ctx.fill(); ctx.stroke();
  E.glowText(ctx, 'SURVEY', 52, 55, { size: 20, weight: 600, spacing: .14, col: kc, glow: false });
  F.maskLine(ctx, [['NOBEL-LEVEL DISCOVERY BY 2030', 0]], 186, 58, 26, F.rise(span(t, a.inside - .1, a.inside + .7)), { serif: false, weight: 700, col: P.cream, glow: false });
  // the lab: a bench with a cool lamp, ten people behind it
  const by = 420;
  // the lab: a cool-lit back wall (the figures read as silhouettes against it), a bench in front
  ctx.fillStyle = E.lin(ctx, 0, 100, 0, by, [[0, mixHex(P.night1, COOL.deep, .7)], [1, mixHex(COOL.deep, COOL.body, .45)]]); ctx.beginPath(); ctx.roundRect(34, 96, 456, by - 96, 6); ctx.fill();
  halo(ctx, 262, by - 150, 240, .2, COOL.halo, COOL.core);
  for (let i = 0; i < 10; i++) {
    const x = 62 + i * 44, rise = i === 6 ? 0 : expoOut(span(t, a.nine + .1 + i * .06, a.nine + .55 + i * .06)) * (1 - sineIO(span(t, a.stakeThat + .1 + i * .03, a.stakeThat + .8 + i * .03)));
    E.person(ctx, x, by + 4, 150 + (i % 3) * 8, { dir: i < 5 ? 1 : -1, light: .7, armR: [lerp(.2, 2.92, rise), lerp(.1, 3.08, rise)], look: .3 * rise });
    if (rise > .5) halo(ctx, x + (i < 5 ? 1 : -1) * 8, by - 190, 22, .35 * (rise - .5), GOLD.halo, GOLD.core);
  }
  ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(34, by - 40, 456, 10); ctx.fillRect(44, by - 30, 8, 30); ctx.fillRect(472, by - 30, 8, 30);
  F.goldText(ctx, [['91 %', 1]], 530, 250, 112, F.rise(span(t, a.nine + .5, a.nine + 1.3)), { serif: true });
  F.maskLine(ctx, [['OF STAFF', 0]], 534, 296, 26, F.rise(span(t, a.nine + .8, a.nine + 1.5)), { serif: false, weight: 700, col: P.cream, glow: false });
  ctx.fillStyle = rgba(GOLD.line, .4); ctx.fillRect(534, 336, 220, 1.5);
  F.maskLine(ctx, [['U.S. ADULTS: 39 %', 0]], 534, 380, 26, F.rise(span(t, a.nine + 2.2, a.nine + 2.9)), { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
}

// the dawn's warm light over the whole picture (the world's disc and band sit outside this frame: the light is what we see)
function dawnWash(ctx, dw) {
  if (dw <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = E.rad(ctx, 1500, -260, 1700, [[0, rgba(GOLD.halo, .3 * dw)], [.5, rgba(GOLD.mid, .1 * dw)], [1, rgba(GOLD.mid, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// ================================================================================================================ the scene
function scene(B, T) {
  const { a } = B;
  return (ctx, t) => {
    const c = B.cam(t), you = you11(t, a), stg = B.stage(t), tp = tablePop(t, a);
    const st = {
      lit: B.lit(t), stage: stg, you: false, dawn: B.dawn(t),
      topTable: tp >= 1 ? { a: 1, lights: 0 } : null,
      land: (cx) => {
        lawTable(cx, t, B.lawK(t), { sheet: 1, tablet: 1, papL: 1, papR: 1 });
        if (tp < 1) tableUnfolding(cx, t, tp); else placeOnTop(cx, t, {});
        seated(cx, neighbour(t, a)); seated(cx, child(t, a));
        figure(cx, you);
      },
    };
    S.stairsWorld(ctx, c, t, st);
    dawnWash(ctx, B.dawn(t));
    shareCaption(ctx, t, a);
    // ---- S.01 / S.02 the lab card out of the door and back
    const lu = span(t, a.inside - .3, a.inside + 1.5) * (1 - span(t, a.stakeThat + 1.0, a.stakeThat + 2.8));
    veilL(ctx, .5 * smooth(span(t, a.inside - .3, a.inside + 1.2)) * (1 - smooth(span(t, a.stakeThat + 1.0, a.stakeThat + 2.6))), 1150);
    if (lu > 0) { const d = S.doorPt(c); if (d) grow(ctx, { x: d.x - 6 * d.k, y: d.y - 10 * d.k, w: 12 * d.k, h: 20 * d.k }, LAB, lu, (cx, e) => labCard(cx, t, a, e)); }
    F.source(ctx, t, a.inside + .9, a.stakeThat + 1.8, F.SOURCES.nobelSrc);
    F.counter(ctx, t, T);
  };
}
