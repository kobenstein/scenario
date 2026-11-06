// c01 · Hook · the line that aimed at Friday · ahead of schedule · the bend · the second line · 0 → T.G('So what bent the first line')
// Built by the lead as the QUALITY REFERENCE. Plan: docs/shots.md 1.01–1.06 (source tools/shots19.py) · world/rules: docs/MOTION.md ·
// kit: lib/f19_kit.mjs. ONE entry, ONE world (THE SHEET: the 1960 Science page on graph paper under one lamp), ONE continuous camera:
// close on the racing ink head → pull back to the whole page (masthead) → push into 1950–2000 (the real line, you) → tilt up the
// dashes to ∞ → truck right while the light line shoots up. The chunk ends on plateLines (lib/f19_seams.mjs) for the last .5 s:
// every state below converges onto LINES_PLATE (camera, sheet light, chart state, you at the knee).
//
// | ID    | anchor (word)                      | picture (one idea)                                                   | 1–2 moves                 | camera                 |
// |-------|------------------------------------|----------------------------------------------------------------------|---------------------------|------------------------|
// | 1.01  | predicted · this Friday · thirteenth | the red ink head races up the curve toward the pinned slip FRI 13    | ink head · slip trembles  | follows the head (expo)|
// | 1.02  | formula · Science · nineteen sixty | pull back: the curve is a chart on the 1960 Science page              | masthead rises · ring 1960| big pull back          |
// | 1.03  | machines · Not yet · about us · ∞ · now | a cool glint dies; ink people stand up along the curve; ∞; NOW   | people · ∞                | breathing push         |
// | 1.04  | Sounds crazy · for decades · ahead · born ahead | the curve goes dashed; the real line draws on it; you stand up | real line · you         | push into 1950–2000    |
// | 1.05  | bent · never allowed               | you walk to the knee, the line bends under you; a bead runs up the dashes | the walk · the bead   | tilt up after the bead |
// | 1.06★ | second line · faster · artificial intelligence | the cool light line shoots past the top; lamp dims; you turn | the light line          | truck right → plate    |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import { plateLines, youAtKnee, LINES_PLATE, SEAM_HALF, PLATE_DRIFT } from '../lib/f19_seams.mjs';
const { rgba, mixHex, clamp, lerp, span, smooth, expoOut, camAt, camDrift, aim } = E;
const { PAL, ZS, CH, KNEE, yearX, popY, realPop, formulaPts, sheet, chart1960, onSheet, bump } = F;

export const PRINT = F.PRINT19;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.friday = G('this Friday'); a.thirteenth = G('thirteenth', a.friday); a.thE = GE('thirteenth', a.friday);
  a.prophet = G('Not by a prophet'); a.formula = G('formula', a.prophet); a.science = G('Science', a.prophet); a.sixty = G('nineteen sixty', a.prophet);
  a.machines = G('machines', a.sixty); a.notyet = G('Not yet', a.machines); a.us = G('about us', a.notyet); a.inf = G('infinity', a.us); a.now = G('Right about now', a.inf);
  a.crazy = G('Sounds crazy'); a.decades = G('for decades', a.crazy); a.schedule = G('schedule', a.decades); a.ahead = G('ahead', a.schedule);
  a.born = G('born ahead', a.ahead); a.then = G('Then the line', a.born); a.bent = G('bent', a.then); a.never = G('never allowed', a.bent);
  a.second = G('second line', a.never); a.faster = G('faster than', a.second); a.isnt = G("isn't people", a.faster); a.ai = G('artificial intelligence', a.isnt);
  a.end = R.b;
  return [{ t: 0, draw: scene(a), print: PRINT }];
};

// arc fraction of the formula polyline at a given year (the ink head's position)
const FL = (() => { const L = [0]; for (let i = 1; i < formulaPts.length; i++) L.push(L[i - 1] + Math.hypot(formulaPts[i][0] - formulaPts[i - 1][0], formulaPts[i][1] - formulaPts[i - 1][1])); return L; })();
const uAtX = (x) => { let i = 1; while (i < formulaPts.length - 1 && formulaPts[i][0] < x) i++; return FL[i] / FL[FL.length - 1]; };
const onReal = (yr) => [yearX(yr), popY(realPop(yr))];
const RIM_WARM = mixHex(E.P.coat, E.P.core1, .75);
const YOU_H = LINES_PLATE.you.h, BORN = 1980;
const easeOut3 = (x) => 1 - (1 - clamp(x)) ** 3;

function scene(a) {
  const T0 = a.end, tPlate = T0 - SEAM_HALF;
  const PC = LINES_PLATE.cam, PS = LINES_PLATE.sheet;
  const fuAt = (t) => { const x = span(t, 0, a.thE + .3); return lerp(uAtX(yearX(1984)), 1, .3 * x + .7 * E.sineIO(x) * (2 - E.sineIO(x)) / 1); };
  // the camera: one plan sequence on word keys (sine-S unless marked), breathing pushes in between
  const K = [
    [0, aim(ZS, 1400, -70, .57)],                                    // hard start mid-motion: the ink head racing up toward the slip
    [a.prophet - .1, aim(ZS, 1614, -652, 1.3)],                      // one long push in along the line: the slip and the stopped head
    [a.science + .7, aim(ZS, 920, -20, .57)],                        // 1.02 big pull back: the whole page, masthead
    [a.us - .2, aim(ZS, 930, -12, .58)],                             // breathing
    [a.us + 1.9, aim(ZS, 985, -75, .565)],                           // 1.03 lean toward the people
    [a.crazy - .1, aim(ZS, 1000, -70, .575)],
    [a.decades + .9, aim(ZS, 1290, 650, 1.5)],                        // 1.04 push into 1900–2030: the real line on the dashes
    [a.bent + .7, aim(ZS, 1420, 600, 1.86)],                         // one long push (no stop before you are born), then follow you to the knee
    [a.never + 1.7, aim(ZS, 1520, -190, .6)],                        // tilt up + pull back after the bead to ∞ and the slip
    [a.faster + .2, aim(ZS, 1820, -140, .56)],                       // 1.06 truck right with the light line as it shoots up
    [tPlate, PC],                                                      // settle exactly on plateLines
  ];
  return (ctx, t) => {
    if (t >= tPlate) return plateLines(ctx, t);
    const dAmt = lerp(1, PLATE_DRIFT, smooth(span(t, tPlate - 1.6, tPlate)));   // the same drift as the plate at tPlate
    const c0 = camAt(t, K, ZS);
    const c = camDrift(c0, t, dAmt);
    // the sheet light: the lamp pool starts on the slip and settles where the plate has it; it dims when the machine's light comes
    const lk = smooth(span(t, a.prophet, a.crazy + 1.5)), aiU = span(t, a.second - .1, a.faster + 1.4);
    const coolK = smooth(span(t, a.second, a.faster + 2.2));
    sheet(ctx, c, t, {
      lamp: [lerp(1520, PS.lamp[0], lk), lerp(-260, PS.lamp[1], lk)], lampR: lerp(2000, PS.lampR, lk), dim: PS.dim * coolK,
      cool: [PS.cool[0], PS.cool[1], PS.cool[2], PS.cool[3] * coolK],
    });
    // the 1960 page, state by state (ends exactly on LINES_PLATE.st)
    const out = (t0, d) => 1 - span(t, t0, t0 + d);
    const ruT = t < a.decades - .5 ? -1
      : t < a.ahead - .1 ? lerp(1800, 1972, easeOut3(span(t, a.decades - .5, a.schedule + .5)))
      : t < a.then ? lerp(1972, BORN + 1.6, smooth(span(t, a.ahead - .1, a.ahead + 1.1)))
      : null;
    // you: a yellow dot lands on the line at 1980 and grows; you walk to the knee; the line bends under your feet, then on to 2026
    const walk = smooth(span(t, a.then + .1, a.bent + .75)), youYr = lerp(BORN, KNEE.yr, walk);
    const ru = ruT === -1 ? null : ruT ?? (t < a.bent + .75 ? Math.max(BORN, youYr + 1.6) : lerp(KNEE.yr + 1.6, 2026, smooth(span(t, a.bent + .75, a.never + .7))));
    const st = {
      mast: span(t, a.science - .5, a.science + 1.3), axes: span(t, a.formula - .3, a.science + .9), pplLab: span(t, a.us, a.us + 1),
      fu: fuAt(t), head: true,
      dash: smooth(span(t, a.crazy + .1, a.crazy + 1.1)),
      cap: Math.min(span(t, a.formula, a.formula + 1), out(a.crazy, .8)),
      r60: Math.min(span(t, a.sixty, a.sixty + .9), out(a.crazy + .1, .8)),
      glint: t > a.machines - .15 && t < a.notyet + .55 ? span(t, a.machines - .15, a.notyet + .55) : 0,
      ppl: span(t, a.us, a.us + 2.6) * out(a.crazy, 1.1), pplA: 1,
      inf: span(t, a.inf - .05, a.inf + .9), now: span(t, a.now, a.now + .8),
      ru, ahead: Math.min(span(t, a.ahead - .1, a.ahead + .9), out(a.then, .8)),
      pulse: span(t, a.never - .2, a.never + 1.6),
      slip: { day: 'FRI', num: '13', mon: 'NOV 2026', swing: .012 * Math.sin(t * 1.1) + .05 * bump(t, a.friday + .1, .55) * Math.sin(t * 38) },
      ai: aiU ** 1.25, aiSpill: 1 - span(t, a.faster + 1.4, a.faster + 3), aiLab: span(t, a.ai, a.ai + 1),
    };
    if (st.pulse >= 1) st.pulse = 0;
    chart1960(ctx, c, t, st);
    // you
    onSheet(ctx, c, () => {
      const g = span(t, a.born + .25, a.born + 1.3);
      if (t < a.born - .2) return;
      if (t < a.then + .1) {
        const [x, y] = onReal(BORN), land = expoOut(span(t, a.born - .2, a.born + .25));
        if (g < .08) { ctx.fillStyle = E.P.coat; ctx.beginPath(); ctx.arc(x, y - 8 - (1 - land) * 160, 7 * land + 2, 0, 6.29); ctx.fill(); return; }
        const br = Math.sin(t * 1.6) * .03;
        F.you(ctx, x, y, YOU_H * expoOut(g), { ...LINES_PLATE.you.o, view: 'side', look: .15, rim: RIM_WARM, armR: [.12 + br, .08], armL: [-.14 - br, -.06] });   // side view like the walk that follows (no pose pop)
        return;
      }
      if (t < a.bent + .75) {   // the walk: side view, steps from the distance walked
        const [x, y] = onReal(youYr), dist = (yearX(youYr) - yearX(BORN)) / YOU_H;
        F.you(ctx, x, y, YOU_H, { dir: 1, light: 1, walk: dist * 5.2, rim: RIM_WARM, look: .1 });
        return;
      }
      // at the knee: the head follows the bead up the dashes, then turns to the light line, the cool rim comes up
      const look = lerp(lerp(.1, .95, smooth(span(t, a.never - .1, a.never + 1.3))), LINES_PLATE.you.o.look, smooth(span(t, a.second + .3, a.faster + 1.8)));
      youAtKnee(ctx, t, { look, rim: coolK >= 1 ? PAL.cool1 : mixHex(RIM_WARM, PAL.cool1, coolK) });
    });
  };
}
