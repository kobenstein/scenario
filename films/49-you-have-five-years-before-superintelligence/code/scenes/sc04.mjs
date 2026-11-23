// Film 49 · c04 · A FRESH START (B1). Continues the B1 camera (sc02 group()). Takes over the c03 props on tread 0 (two doors, the
// shoved person, the torn pay slip, the place card) and lets them sink; ends at the foot of the carved stair of block 1 (c05 climbs).
//
// | beat  | phrase (VO)                           | picture                                                                                | camera / kind     |
// |-------|---------------------------------------|----------------------------------------------------------------------------------------|-------------------|
// | 5.10  | What the next generation always had   | pull back left: on the old stair the child climbs onto the plain, a new landing, and a | pull back · SCENE |
// |       |                                       | pool of light opens under it (no luggage)                                              |                   |
// | 5.11★ | So choose your own, while nothing …   | a gold line runs from the child's pool to door 1; you walk through door 1 yourself;    | push · SCENE      |
// |       |                                       | the place card gets its first thin gold stroke                                         |                   |
// | 5.12  | Become a beginner … the awkward part  | a beginners' class rises: three easels; your first try is a crooked gold line          | truck · SCENE     |
// | 5.13  | At work, take on one new role …       | a round table; on 'before anyone asks' you raise your hand                              | truck · SCENE     |
// | 5.14  | Join one group … still somebody there | a choir on a low riser (no name tags); your place card tips over and lies face down     | truck · SCENE     |
// | 5.15  | Resilience is partly practice …       | a small door, then a bigger one: you walk through both; source NATURE REV. PSYCHOLOGY  | truck · EXPL      |
// | 5.16  | But starting over is only half of it  | you turn: behind you your working life rises as a shelf of folders and tools           | creep · MIX       |
// | 5.17  | If a machine can do your task …       | a sheet on a lectern fills itself in one minute: 1 MIN (no clock); everything sinks,   | rise · EXPL       |
// |       |                                       | you walk to the carved stair of the second step; the camera rises                      |                   |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
import { group, walk, pop, upDown, popPerson, lightDoor, cardAt, SY0, SIL } from './sc02.mjs';
import { C3, SLIP, room, paySlip } from './sc03.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, mixHex, halo, lin, P, W, H } = E;
const { GOLD, PAPER, COOL, LAMP } = F;
const TAU = Math.PI * 2;
export const C4 = { stairX: S.STEPS[1].L - 84, card: C3.card };

export default async (T, R) => {
  const G = group(T);
  return [{ t: R.a, draw: scene(T, G), print: F.PRINT49 }];
};

function easel(ctx, t, x, y, o = {}) {
  ctx.fillStyle = SIL; ctx.strokeStyle = SIL; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 22, y); ctx.lineTo(x - 2, y - 150); ctx.moveTo(x + 22, y); ctx.lineTo(x + 2, y - 150); ctx.moveTo(x + 6, y - 120); ctx.lineTo(x + 30, y); ctx.stroke();
  ctx.fillRect(x - 34, y - 92, 68, 5);
  ctx.fillStyle = lin(ctx, 0, y - 140, 0, y - 92, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(x - 30, y - 142, 60, 50);
  if (o.neat) { ctx.fillStyle = rgba(COOL.deep, .8); ctx.fillRect(x - 20, y - 126, 40, 4); ctx.fillRect(x - 20, y - 116, 28, 4); ctx.beginPath(); ctx.arc(x + 12, y - 105, 6, 0, TAU); ctx.fill(); }
  if (o.stroke > 0) F.goldSpan(ctx, [[x - 22, y - 108], [x - 12, y - 126], [x - 4, y - 112], [x + 6, y - 131], [x + 12, y - 115], [x + 22, y - 124]], 0, o.stroke, { w: 2.2, spark: o.stroke < 1 });
}
function shelf(ctx, t, x, y) {   // your working life: a shelf of folders, binders and tools
  const w = 160, h = 182; ctx.fillStyle = SIL;
  ctx.fillRect(x, y - h, 7, h); ctx.fillRect(x + w - 7, y - h, 7, h); ctx.fillRect(x, y - h, w, 7);
  for (const yy of [y - 122, y - 62, y - 4]) ctx.fillRect(x, yy, w, 6);
  const r = E.prng(404); let xx = x + 12;
  while (xx < x + w - 22) { const bw = 9 + r() * 9, bh = 38 + r() * 16, col = [PAPER.shade, mixHex(P.ind2, P.blue1, .5), mixHex(GOLD.shade, P.night1, .4), PAPER.body][Math.floor(r() * 4)]; ctx.fillStyle = col; ctx.fillRect(xx, y - 122 - bh, bw, bh); xx += bw + 2; }
  ctx.fillStyle = mixHex(GOLD.shade, P.night1, .3); ctx.fillRect(x + 14, y - 96, 60, 34); ctx.fillStyle = SIL; ctx.fillRect(x + 34, y - 104, 20, 5);   // toolbox
  ctx.fillStyle = mixHex(GOLD.mid, P.night1, .35); ctx.beginPath(); ctx.ellipse(x + 112, y - 62, 24, 18, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(x + 84, y - 64, 56, 4);   // a hard hat
  ctx.fillStyle = PAPER.body; for (let i = 0; i < 3; i++) ctx.fillRect(x + 18 + i * 40, y - 46 + i * 2, 30, 40 - i * 2);   // stacked folders
}
function lectern(ctx, t, x, y, fill) {   // a stand with one sheet; the sheet fills itself (cool lines = the machine)
  ctx.fillStyle = SIL; ctx.fillRect(x - 4, y - 96, 8, 96); ctx.fillRect(x - 26, y - 4, 52, 4);
  ctx.save(); ctx.translate(x, y - 100); ctx.rotate(-.12);
  ctx.fillStyle = SIL; ctx.fillRect(-42, -4, 84, 8);
  ctx.fillStyle = lin(ctx, 0, -70, 0, 0, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-36, -72, 72, 68);
  const n = 7; for (let i = 0; i < n; i++) { const u = clamp(fill * n - i); if (u <= 0) break; ctx.fillStyle = rgba(COOL.deep, .9); ctx.fillRect(-28, -62 + i * 8.6, (i % 3 === 2 ? 34 : 54) * expoOut(u), 3.4); }
  if (fill > 0 && fill < 1) halo(ctx, 0, -36, 60, .25, COOL.halo, COOL.core);
  ctx.restore();
}

function scene(T, G) {
  const { a } = G;
  return (ctx, t) => {
    const c = G.cam(t);
    // ---- you
    const w1 = walk(t, a.choose + .3, a.choose + 1.9, C3.d1 + 60, 520, 0, .5);
    const w2 = walk(t, a.beginner + .4, a.beginner + 1.4, 520, 600, 0, .4);
    const w3 = walk(t, a.role + .1, a.role + 1.3, 600, 715, 0, .4);
    const w4 = walk(t, a.group + .2, a.group + 1.6, 715, 548, 0, .45);
    const w5 = walk(t, a.resil + .5, a.bigChange + 1.6, 548, 905, 0, .6);
    const w6 = walk(t, a.worth - .2, a.worth + 1.6, 905, C4.stairX, 0, .5);
    const hand = smooth(span(t, a.anyone - .6, a.anyone - .1)) * (1 - smooth(span(t, a.group - .6, a.group - .1)));
    let you;
    if (t < a.choose + .3) you = { x: C3.d1 + 60, y: SY0, o: { dir: -1, look: .35 + .05 * Math.sin(t * .5), back: .4 } };
    else if (w1.moving) you = { x: w1.x, y: SY0, o: { walk: w1.ph, dir: -1, back: .5 } };
    else if (t < a.beginner + .4) you = { x: 520, y: SY0, o: { dir: -1, look: lerp(.2, .05, smooth(span(t, a.nothing, a.nothing + .6))), back: .45 } };
    else if (w2.moving) you = { x: w2.x, y: SY0, o: { walk: w2.ph, dir: 1 } };
    else if (t < a.role + .1) { const p = Math.sin(t * 2.2); you = { x: 600, y: SY0, o: { dir: 1, look: .1, back: .3, armR: [1.3 + .08 * p, 1.6 + .1 * p], lean: .04 } }; }
    else if (w3.moving) you = { x: w3.x, y: SY0, o: { walk: w3.ph, dir: 1 } };
    else if (t < a.group + .2) you = { x: 715, y: SY0, o: { dir: 1, look: .2 + .25 * hand, back: .3, armR: [lerp(.2, 2.95, hand), lerp(.1, 3.05, hand)] } };
    else if (w4.moving) you = { x: w4.x, y: SY0, o: { walk: w4.ph, dir: -1 } };
    else if (t < a.resil + .5) you = { x: 548, y: SY0 - 16 * smooth(span(t, a.group + 1.6, a.group + 2.0)) * (1 - smooth(span(t, a.resil - .1, a.resil + .3))), o: { dir: 1, look: .45 + .05 * Math.sin(t * 1.3), back: .3, lean: .02 * Math.sin(t * 1.1) } };
    else if (w5.moving) you = { x: w5.x, y: SY0, o: { walk: w5.ph, dir: 1 } };
    else if (t < a.half + .1) you = { x: 905, y: SY0, o: { dir: 1, look: .4, back: .3 } };
    else if (t < a.worth - .2) you = { x: 905, y: SY0, o: { dir: -1, look: .2, back: .3 } };
    else if (w6.moving) you = { x: w6.x, y: SY0, o: { walk: w6.ph, dir: -1 } };
    else you = { x: C4.stairX, y: SY0, o: { dir: 1, look: lerp(.3, .6, smooth(span(t, a.worth + 1.6, a.worth + 2.4))), back: .3 } };
    // ---- the props
    const chU = 1 - span(t, a.fresh + .3, a.fresh + 1.0);                       // CHOSEN / FORCED sink
    const d2U = 1 - span(t, a.fresh + 1.0, a.fresh + 2.0);                      // door 2, the shoved person and the slip sink (wide shot)
    const d1U = 1 - span(t, a.beginner - .4, a.beginner + .4);
    const childU = sineIO(span(t, a.fresh + .4, a.fresh + 3.4)), childX = lerp(-2050, -1300, childU);
    const goldU = 1.45 * span(t, a.choose + .2, a.choose + 3.1);
    const stroke = smooth(span(t, a.nothing - .1, a.nothing + .7));
    const tip = smooth(span(t, a.title - .3, a.title + .3));
    const classU = upDown(t, a.beginner + .1, a.role - .5, .7), roundU = upDown(t, a.role - .1, a.group - .4, .7), choirU = upDown(t, a.group + .9, a.resil - .5, .7);
    const doorsU = upDown(t, a.resil - .2, a.half - .6, .8), shelfU = upDown(t, a.half + .3, a.worth - .1, .8), lecU = upDown(t, a.minute + .1, a.worth - .2, .6);
    const fill = smooth(span(t, a.minute + .9, a.minute + 1.9));
    const st = {
      old: .6, lit: G.lit(t), you,
      people: childU > 0 && childU < 1 ? [{ x: childX, y: S.oldY(childX), h: 118, kind: 'person', o: { walk: childU * 22, dir: 1, back: .4 } }]
        : t > a.fresh + .4 ? [{ x: childX, y: S.oldY(childX), h: 118, kind: 'person', o: { look: .5, back: .4, dir: 1 } }] : [],
      land: (cx) => {
        // the child's new landing: a pool of light opens on the plain under it
        const pu = smooth(span(t, a.fresh + 3.0, a.fresh + 4.2));
        if (pu > 0) { cx.save(); cx.globalCompositeOperation = 'lighter'; cx.fillStyle = E.rad(cx, -1300, S.GY, 220, [[0, rgba(GOLD.core, .5 * pu)], [1, rgba(GOLD.halo, 0)]]); cx.beginPath(); cx.ellipse(-1300, S.GY + 2, 240 * expoOut(pu), 22, 0, 0, TAU); cx.fill(); cx.restore(); }
        // ★ the gold line: from the child's pool along the plain, up the carved stair, to door 1
        if (goldU > 0 && goldU < 1.45) F.goldSpan(cx, [[-1300, S.GY], [328, S.GY], [348, S.GY - 25], [370, S.GY - 50], [392, S.GY - 75], [414, S.GY - 100], [438, SY0], [C3.d1, SY0]], Math.max(0, goldU - .45), Math.min(1, goldU), { w: 5, spark: goldU < 1 });
        // the place card: the first gold stroke (★), later it tips over and lies face down (the choir)
        if (tip < 1) { cx.save(); cx.translate(C3.card, SY0 + 1); cx.scale(1, lerp(1, .1, tip)); cx.translate(-C3.card, -(SY0 + 1)); cardAt(cx, t, { at: [C3.card, SY0 + 1], s: 44, gold: stroke, glow: .4 + .4 * F.bump(t, a.nothing, 1.2) }); cx.restore(); }
        else cardAt(cx, t, { at: [C3.card, SY0 + 1], s: 44, face: 'down' });
        // c03's doors, the shoved person and the slip (they sink)
        if (d1U > 0) lightDoor(cx, t, C3.d1, SY0, C3.dw, C3.dh, d1U, { glow: 1 + .5 * F.bump(t, a.choose + .6, 1.6), inner: (x, y, w, h) => room(cx, t, x, y, w, h, 1) });
        if (d2U > 0) {
          lightDoor(cx, t, C3.d2, SY0, C3.dw, C3.dh, d2U);
          popPerson(cx, t, d2U, C3.man - 18, SY0, 160, { dir: 1, light: -1, back: .6, lean: -.05, look: .3, armR: [.2, .1], armL: [-.2, -.1] });
          paySlip(cx, t, d2U, 1, SLIP.x + 75, SY0);
        }
        if (chU > 0) { F.goldText(cx, [['CHOSEN', 1]], C3.d1, SY0 + 46, 26, F.rise(chU), { serif: false, weight: 700, spacing: .12, align: 'center' }); F.goldText(cx, [['FORCED', 0]], C3.d2, SY0 + 46, 26, F.rise(chU), { serif: false, weight: 700, spacing: .12, align: 'center', col: P.halo2 }); }
        // 5.12 the beginners' class: your easel (a crooked first try in gold) and two young beginners with neat cool work
        if (classU > 0) {
          pop(cx, classU, SY0, () => easel(cx, t, 645, SY0, { stroke: smooth(span(t, a.awkward - .7, a.awkward + 1.1)) }));
          pop(cx, clamp(classU * 1.2 - .1), SY0, () => easel(cx, t, 770, SY0, { neat: true }));
          pop(cx, clamp(classU * 1.3 - .2), SY0, () => easel(cx, t, 880, SY0, { neat: true }));
          popPerson(cx, t, clamp(classU * 1.2 - .1), 730, SY0, 142, { dir: 1, back: .5, rim: COOL.line, armR: [1.3, 1.7], look: .1 });
          popPerson(cx, t, clamp(classU * 1.3 - .2), 840, SY0, 146, { dir: 1, back: .5, rim: COOL.line, armR: [1.25, 1.6], look: .1 });
        }
        // 5.13 a round at work: a round table, two colleagues
        if (roundU > 0) {
          pop(cx, roundU, SY0, () => { cx.fillStyle = SIL; cx.beginPath(); cx.ellipse(800, SY0 - 62, 54, 10, 0, 0, TAU); cx.fill(); cx.fillRect(796, SY0 - 60, 8, 60); cx.fillRect(776, SY0 - 4, 48, 4);
            cx.fillStyle = rgba(PAPER.lit, .7); cx.fillRect(772, SY0 - 70, 22, 3); cx.fillRect(808, SY0 - 69, 18, 3); });
          popPerson(cx, t, clamp(roundU * 1.2 - .1), 878, SY0, 158, { dir: -1, light: 1, back: .5, look: .15 + .1 * hand, long: true });
          popPerson(cx, t, clamp(roundU * 1.3 - .2), 935, SY0, 150, { dir: -1, light: 1, back: .5, look: .2 + .1 * hand });
        }
        // 5.14 the choir: a low riser, singers (no name tags), a warm lamp over them
        if (choirU > 0) {
          pop(cx, choirU, SY0, () => { cx.fillStyle = mixHex(P.night1, P.ind1, .5); cx.fillRect(515, SY0 - 16, 220, 16); cx.fillStyle = rgba(GOLD.line, .4); cx.fillRect(515, SY0 - 17, 220, 2); halo(cx, 625, SY0 - 120, 190, .22 * choirU, GOLD.halo, LAMP.core); });
          [[600, 0], [648, .1], [696, .2]].forEach(([x, d], i) => popPerson(cx, t, clamp(choirU * 1.3 - d), x, SY0 - 16, 150 + (i % 2) * 8, { dir: -1, light: 1, back: .45, look: .45 + .05 * Math.sin(t * 1.3 + i), lean: .02 * Math.sin(t * 1.1 + i * .7) }));
        }
        // 5.15 a small door, then a bigger one
        if (doorsU > 0) { lightDoor(cx, t, 690, SY0, 58, 118, doorsU, { glow: .7 }); lightDoor(cx, t, 830, SY0, 100, 215, clamp(doorsU * 1.2 - .2)); }
        // 5.16 your working life: the shelf; 5.17 the sheet that fills itself, 1 MIN
        if (shelfU > 0) pop(cx, shelfU, SY0, () => shelf(cx, t, 650, SY0));
        if (lecU > 0) {
          pop(cx, lecU, SY0, () => lectern(cx, t, 845, SY0, fill));
          const lu = span(t, a.minute + 1.4, a.minute + 2.1) * (1 - span(t, a.worth - .3, a.worth + .2));
          if (lu > 0) F.goldText(cx, [[F.SOURCES.oneMin, 1]], 845, SY0 - 196, 40, F.rise(lu), { serif: true, align: 'center' });
        }
      },
    };
    S.stairsWorld(ctx, c, t, st);
    F.counter(ctx, t, T);
    F.source(ctx, t, a.resil + .4, a.half, F.SOURCES.resilience);
  };
}
