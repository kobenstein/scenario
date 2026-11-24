// Film 49 · c05 · STEP 4 · YOUR WORK (B1). Continues the B1 camera (sc02 group()) and lands on plateWork at 'But you can only do so
// much' (the last .5 s are the plate; the camera runs the plate's creep backwards before it, see group().cam).
// Stage 1 layout (land x): the carved stair 561 → 671 · you at the edge 700 · desks of the office set 745 / 925 / 1105 · your desk
// (S.workDesk) 1010 · the bars stand on tread 2 (x 1160 →) · the wall calendar on riser 2 (S.workDesk: 1050, 595).
//
// | beat  | phrase (VO)                          | picture                                                                                   | camera / kind     |
// |-------|--------------------------------------|-------------------------------------------------------------------------------------------|-------------------|
// | 4.01  | Four years to go (STEP HIT)          | the second step lights (F.stepLight 1), the first settles; counter 4 YEARS TO GO; you     | rise · MIX        |
// |       | This step is your work               | climb; the office rises out of the tread: desks, cool screens, young faces; you at the edge|                   |
// | 4.02  | And here, there is evidence …        | a pool of light searches across the office                                                 | truck · MIX       |
// | 4.03  | One A.I. company studied …           | two equal tools, two figures: EXPERT · BEGINNER                                           | push · EXPL       |
// | 4.04★ | Experts succeeded more than twice …  | bars rise on the next tread: EXPERT-RATED over 2× · NOVICE 1× (no invented %); source     | rise · EXPL       |
// | 4.05  | In that study … did not level …      | the bars stay                                                                             | creep · EXPL      |
// | 4.06  | It rewarded the people who knew …    | the light moves from the young faces to you at the edge                                    | glide · MIX       |
// | 4.07  | Does that make you safe? … one tool  | under the bars: MEASURED IN ONE CODING TOOL                                               | glide · EXPL      |
// | 4.08  | And when people in their late fifties| the bars sink; the wall calendar opens and counts weeks: 34 WEEKS; source AARP / BLS       | push · EXPL       |
// | 4.09  | So experience is an edge …           | the colleagues sink; the calendar closes; you walk to your desk and reach for the tool    | glide · MIX       |
// | 4.10  | Learn the machine on the job …       | you at your desk, the tool next to the usual work → plateWork                              | creep · MIX       |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
import { group, walk, pop, upDown, popPerson, cardAt, SY0, SY1, SIL } from './sc02.mjs';
import { C4 } from './sc04.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, mixHex, halo, lin, P, W, H } = E;
const { GOLD, PAPER, COOL, LAMP } = F;
const TAU = Math.PI * 2;
const DESK = S.WORK_DESK.x, CAL = { x: DESK + 40, y: S.STEPS[2].top + 40 }, SY2 = S.STEPS[2].top - 2;

export default async (T, R) => {
  const G = group(T);
  return [{ t: R.a, draw: scene(T, G), print: F.PRINT49 }];
};

// your desk rising with the office: the desk part out of the tread, the wall calendar unrolling down from its top edge
function deskRise(ctx, t, u) {
  if (u >= 1) { S.workDesk(ctx, t); return; }
  if (u <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(DESK - 200, CAL.y - 60, 420, 400); ctx.rect(CAL.x - 36, CAL.y - 2, 72, 64); ctx.clip('evenodd');
  pop(ctx, u, SY1, () => S.workDesk(ctx, t)); ctx.restore();
  const k = expoOut(clamp(u * 1.3 - .3)); if (k <= 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(CAL.x - 36, CAL.y - 2, 72, 64); ctx.clip();
  ctx.translate(0, CAL.y); ctx.scale(1, k); ctx.translate(0, -CAL.y); S.workDesk(ctx, t); ctx.restore();
}
// the calendar opening and counting the weeks (drawn over the closed one at the same place)
function calendar(ctx, t, open, n) {
  if (open <= 0) return;
  const { x, y } = CAL, k = expoOut(open);
  ctx.save(); ctx.translate(x, y); ctx.scale(1, k);
  ctx.fillStyle = PAPER.lit; ctx.fillRect(-34, 0, 68, 60); ctx.fillStyle = mixHex(GOLD.deep, P.night1, .3); ctx.fillRect(-34, 0, 68, 12);
  ctx.fillStyle = rgba(PAPER.ink, .25); for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) ctx.fillRect(-28 + j * 12, 18 + i * 10, 7, 5);
  const shown = Math.max(1, Math.round(n)); ctx.fillStyle = rgba(PAPER.lit, .82); ctx.fillRect(-22, 20, 44, 34);
  E.glowText(ctx, String(shown), 0, 50, { size: 30, serif: true, align: 'center', col: PAPER.ink, glow: false });
  ctx.restore();
}

function scene(T, G) {
  const { a } = G, hit = a.hit[1];
  return (ctx, t) => {
    if (t >= a.p1) { S.plateWork(ctx, t, T); return; }
    const c = G.cam(t);
    // ---- you: at the foot of the carved stair (c04) → climb on the step hit → the edge of the office → to your desk → the plate pose
    const climb = smooth(span(t, hit - .1, hit + 1.9));
    const w1 = walk(t, hit + 1.9, hit + 2.5, 671, 700, 1, .25);
    const w2 = walk(t, a.edge + .5, a.guarantee + .9, 700, DESK - 52, 1, .5);
    const reach = smooth(span(t, a.counts - .2, a.counts + .6)) * (1 - smooth(span(t, a.learn - .3, a.learn + .6)));
    let you;
    if (t < hit - .1) you = { x: C4.stairX, y: SY0, o: { dir: 1, look: lerp(.3, .6, smooth(span(t, a.worth + 1.6, a.worth + 2.4))), back: .3 } };
    else if (climb < 1) { const p = S.climbPos(1, climb); you = { x: p.x, y: p.y, o: { walk: climb * 9, dir: 1, back: .3 } }; }
    else if (w1.moving) you = { x: w1.x, y: SY1, o: { walk: w1.ph, dir: 1 } };
    else if (t < a.edge + .5) { const lk = t < a.rewarded ? .35 : lerp(.35, .55, smooth(span(t, a.rewarded + .3, a.rewarded + 1.2))); you = { x: 700, y: SY1, o: { dir: 1, look: lk + .04 * Math.sin(t * .6), back: .3 + .3 * F.bump(t, a.rewarded + .3, 2.5) } }; }
    else if (w2.moving) you = { x: w2.x, y: SY1, o: { walk: w2.ph, dir: 1 } };
    else if (t < a.learn + .6 && reach > 0) you = { x: DESK - 52, y: SY1, o: { dir: 1, look: .15, back: .25, armR: [lerp(.2, 1.45, reach), lerp(.1, 1.7, reach)], lean: .05 * reach } };
    else you = { x: DESK - 52, y: SY1, o: { pose: 'hold', look: .1, back: .2 } };
    // ---- the office and its people
    const stage1 = span(t, hit + .1, hit + 1.0), desk = span(t, hit + .3, hit + 1.2);
    const people = upDown(t, hit + .5, a.late - .5, .8);
    const lbl = span(t, a.oneAI + .6, a.oneAI + 1.4) * (1 - span(t, a.experts - .5, a.experts + .2));
    const barsU = span(t, a.experts + .05, a.experts + 1.6) * (1 - span(t, a.late - .5, a.late + .7));
    const measU = span(t, a.watched + .3, a.watched + 1.0) * (1 - span(t, a.late - .6, a.late + .1));
    const open = span(t, a.late + .3, a.late + 1.0) * (1 - span(t, a.edge + .2, a.edge + .9));
    const weeksN = 1 + 33 * expoOut(span(t, a.late + .9, a.weeks + .7) * 1.0);
    const wU = span(t, a.weeks + .2, a.weeks + 1.0) * (1 - span(t, a.edge + .1, a.edge + .8));
    // the searching light: over the young faces, then (rewarded) to you at the edge
    const sx = t < a.rewarded ? lerp(760, 1170, sineIO(span(t, a.evidence - .2, a.evidence + 2.4))) - 270 * sineIO(span(t, a.oneAI + .2, a.oneAI + 2.2)) * 0
      : lerp(1170, 700, sineIO(span(t, a.rewarded, a.rewarded + 1.8)));
    const sA = smooth(span(t, a.evidence - .3, a.evidence + .6)) * (1 - smooth(span(t, a.edge - .3, a.edge + .6)));
    const st = {
      old: .6 * (1 - span(t, hit + 3, hit + 5)), lit: G.lit(t), you, stage: [0, stage1, 0, 0, 0],
      land: (cx) => {
        cardAt(cx, t, { at: [C4.card, SY0 + 1], s: 44, face: 'down' });
        deskRise(cx, t, desk);
        calendar(cx, t, open, weeksN);
        if (sA > 0) { cx.save(); cx.globalCompositeOperation = 'lighter'; cx.fillStyle = E.rad(cx, sx, SY1, 130, [[0, rgba(GOLD.hot, .38 * sA)], [1, rgba(GOLD.halo, 0)]]); cx.beginPath(); cx.ellipse(sx, SY1 + 2, 140, 14, 0, 0, TAU); cx.fill();
          cx.fillStyle = lin(cx, 0, SY1 - 200, 0, SY1, [[0, rgba(GOLD.halo, 0)], [1, rgba(GOLD.halo, .1 * sA)]]); cx.fillRect(sx - 70, SY1 - 200, 140, 200); cx.restore(); }
        // young faces at their desks; the expert (long coat, older) and the beginner have the same tool
        popPerson(cx, t, people, 806, SY1, 150, { dir: -1, light: 1, back: .55, rim: COOL.line, look: .1, armR: [1.0, 1.5] });
        popPerson(cx, t, clamp(people * 1.2 - .1), 870, SY1, 162, { dir: 1, light: -1, back: .55, rim: COOL.line, look: .05, long: true, armR: [1.1, 1.6] });
        popPerson(cx, t, clamp(people * 1.3 - .2), 1168, SY1, 146, { dir: -1, light: 1, back: .55, rim: COOL.line, look: .12, armR: [1.0, 1.5] });
        if (lbl > 0) { F.goldLabel(cx, 870, SY1 - 168, 'EXPERT', null, lbl, { dx: -30, dy: -34, size: 17 }); F.goldLabel(cx, 1168, SY1 - 152, 'BEGINNER', null, clamp(lbl * 1.2 - .2), { dx: 30, dy: -40, size: 17 }); }
        // ★ the bars on the next tread
        if (barsU > 0) F.bars(cx, t, 1180, SY2, { items: F.SOURCES.expertsBars.map((b, i) => ({ ...b, gold: i ? 0 : 1 })), max: 2.1, h: 230, bw: 76, gap: 84, u: barsU,
          fmt: (v) => (v > 2 ? 'over 2×' : '1×'), vsize: 34, size: 17 });
        if (measU > 0) F.goldText(cx, [[F.SOURCES.measured, .35]], 1260, SY2 + 92, 17, F.rise(measU), { serif: false, weight: 700, spacing: .08, align: 'center' });
        if (wU > 0) F.goldText(cx, [[F.SOURCES.weeks, 1]], CAL.x + 48, CAL.y + 48, 34, F.rise(wU), { serif: true });
      },
    };
    S.stairsWorld(ctx, c, t, st);
    F.counter(ctx, t, T);
    F.source(ctx, t, a.experts + .8, a.late - .3, F.SOURCES.experts);
    F.source(ctx, t, a.weeks + .4, a.edge + .8, F.SOURCES.weeksSrc);
  };
}
