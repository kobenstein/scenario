// c07 · c08 · c09 · B2 · "So don't take Anthropic's word" → 'Their scenario, late'. ONE take for the whole group: this file builds the
// draw function, sc08.mjs and sc09.mjs return the SAME function for their ranges (inner seams c07|c08 and c08|c09 are the same picture).
// Out of S.plateClimb (WIDE_CAM, lamp on, rungs CLIMB, the HUD) → into S.plateMachine (MACH_CAM, build .94, glow 1.15). Plan: docs/shots.md
// 7.01–9.08 · world: docs/MOTION.md. The explainers float over the night veil while the camera keeps gliding behind it (film 59 method).
//
// | ID    | anchor (phrase)                      | picture (one idea)                                                          | carrier → next          |
// |-------|--------------------------------------|-----------------------------------------------------------------------------|-------------------------|
// | 7.01  | So don't take Anthropic's word       | out of plateClimb: push to a cool-lit hall door, three evaluators step in    | their cool light → veil |
// | 7.02★ | Their estimate                       | the gauge: the needle swings to ≈ 1.9× on "twice" · ON BENCHMARKS            | the gauge's band        |
// | 7.03  | And most of that                     | a bar splits off: ≈ 80 % FROM PUTTING A.I. TO WORK (gold) · HUMANS IN THE LOOP| the gauge shrinks → card|
// | 7.04  | But look at where these numbers      | the gauge lands as card 5 of five; each gets SOURCE: THE LAB                 | the cards sink          |
// | 7.05  | And this lab is going public         | the veil thins: a tag IPO · THIS WEEK drops from the ring; "Speed sells": $  | the tag rises away      |
// | 7.06  | The evaluators say                   | their report, lines blacked out one by one · the METR quote                 | the report sinks        |
// | 7.07  | And outside critics                  | two bars: SPENDING 6.19× · PACE 1.91× · "nothing causal can be inferred"    | two trays               |
// | 7.08  | So here's what the evidence supports | two trays: LOOKS REAL (gold) · OPEN FIGHT: HOW BIG? HOW MUCH IS THE MACHINE? | a calendar page         |
// | 8.01  | And for one group                    | the calendar page tears and folds flat: it becomes the timeline rail        | the rail                |
// | 8.02  | They're the people behind            | paper card AI 2027 · A SCENARIO (APRIL 2025) pinned to the rail             | the marker              |
// | 8.03  | As late as August                    | Kokotajlo's marker rises out of the rail at END 2028                        | the gauge card          |
// | 8.04★ | Then the evaluators' report          | the gauge drops onto the rail; the marker slides to MAY 2027; five land     | the band                |
// | 8.05  | Their date marks one machine         | the band flies into the ring's core: A SUPERHUMAN A.I. RESEARCHER           | a builder's eye         |
// | 8.06  | Tao Lin again                        | push to one builder at the ring; its eye grows into the clip plate          | the plate               |
// | 8.07  | slot:T1a                             | CLIP T1a (33 s, the plate holds calm)                                       | the plate steps back    |
// | 9.01  | One point three years                | the plate steps back (left, small); 1.3 YEARS? · TIMELINES TO WHAT?          | the plate grows again   |
// | 9.02  | slot:T1b                             | CLIP T1b (same plate)                                                       | the plate → a pin       |
// | 9.03★ | The end of next year                 | the plate shrinks into a pin on the rail: TAO LIN · END 2027                 | the HUD                 |
// | 9.04  | On the ladder, that's rung three     | the HUD grows big: rung 3 FORECAST; machines building machines               | a scorecard             |
// | 9.05  | Should you believe the forecasters   | their scorecard: ✓ A.I. HELPS BUILD A.I. · ✗ STOCKS UP 30 % · ✗ MASS PROTESTS | a tag                   |
// | 9.06  | And they aren't neutral              | a tag on the card: THEY WANT A PAUSE                                        | the quote               |
// | 9.07  | So it's a forecast                   | quote: "…assuming no substantial deliberate slowdown"                      | the rail                |
// | 9.08  | And that condition                   | a rail splits in two at 2027; one branch runs into the core; veil lifts     | plateMachine            |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f31_kit.mjs';
import * as S from '../lib/f31_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth } = E;
const { rise, FORGE, COOL, PAPER, maskLine, measure } = F;
const TAU = Math.PI * 2;

export const PRINT = F.PRINT31;
export default async (T, R) => [{ t: R.a, draw: group(T), print: PRINT }];

// ------------------------------------------------------------------------------------------------ the group's one take (cached per T)
const CACHE = new WeakMap();
export function group(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const G = (p, after = 0, nth = 0) => T.G(p, nth, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.t0 = G("So don't take Anthropic's word"); a.ask = G('Ask the outsiders', a.t0); a.indep = G('independent evaluators', a.t0);
  a.est = G('Their estimate', a.t0); a.twice = G('twice as fast', a.est); a.bench = G('on benchmarks', a.est);
  a.most = G('And most of that', a.est); a.work = G('putting A.I. to work', a.most); a.loop = G('people still in the loop', a.most);
  a.look = G('But look at where', a.most); a.labs = G('labs themselves', a.look); a.hands = G('passed through their hands', a.look);
  a.pub = G('And this lab is going public', a.look); a.week = G('this week', a.pub); a.sells = G('Speed sells', a.pub);
  a.say = G('The evaluators say', a.pub); a.black = G('blacked out', a.say);
  a.crit = G('And outside critics', a.say); a.six = G('six times', a.crit); a.speed2 = G('twice the speed', a.crit);
  a.ev = G("So here's what the evidence", a.crit); a.real = G('looks real', a.ev); a.big = G('How big', a.ev); a.much = G('how much of it', a.ev); a.fight = G('open fight', a.ev);
  a.group = G('And for one group', a.ev); a.cal = G('calendar', a.group);
  a.people = G("They're the people behind", a.group); a.ai27 = G('scenario called', a.people);
  a.aug = G('As late as August', a.people); a.koko = G('Daniel Kokotajlo', a.aug); a.end28 = G('end of twenty twenty-eight', a.aug);
  a.then = G("Then the evaluators' report", a.aug); a.out = G('came out', a.then); a.may = G('May, twenty twenty-seven', a.then); a.team = G('everyone on his team', a.then); a.same = G('same year', a.team);
  a.marks = G('Their date marks', a.then); a.sai = G('superhuman A.I. researcher', a.marks); a.alone = G("And they're not alone", a.marks);
  a.tao = G('Tao Lin again', a.marks);
  const c1a = T.clip('T1a'), c1b = T.clip('T1b');
  a.c1a = c1a.start; a.c1aE = c1a.end; a.c1b = c1b.start; a.c1bE = c1b.end;
  a.onept = G('One point three years', a.c1aE - 1); a.tlw = G('timelines to what', a.onept);
  a.nexty = G('The end of next year', a.c1bE - 1); a.insider = G("One insider's view", a.nexty); a.lands = G('But it lands in', a.nexty);
  a.rung3 = G("On the ladder, that's rung three", a.nexty); a.design = G('machines can design', a.rung3);
  a.believe = G('Should you believe', a.rung3); a.check = G('Check their record', a.believe); a.right = G('the big thing right', a.believe); a.helps = G('A.I. now helps', a.believe);
  a.stocks = G('stocks up thirty', a.believe); a.protests = G('mass protests', a.believe); a.neither = G('Neither has come', a.believe);
  a.neutral = G("And they aren't neutral", a.believe); a.pause = G('want the whole industry', a.neutral);
  a.cond = G("So it's a forecast", a.neutral); a.split = G('And that condition', a.cond); a.two = G('splits in two', a.split);
  a.end = G('Their scenario, late', a.split);
  const fn = scene(a, T); CACHE.set(T, fn); return fn;
}

// ------------------------------------------------------------------------------------------------ layout (screen px)
const HALL = (u, v, s) => E.aim(S.Z_HALL, u, v, s);
const MACH = (u, v, s, sx, sy) => E.aim(S.Z_MACH, u, v, s, sx, sy);
const TL = { x: 230, y: 600, w: 1460, y0: 2025, y1: 2031 };
const X = (v) => TL.x + (v - TL.y0) / (TL.y1 - TL.y0) * TL.w;
const BAND = [2027.33, 2027.92];                    // all six medians: May–Nov 2027
const KOKO = { from: 2028.95, to: 2027.37, dy: 150 };
const FIVE = [[2027.47, 95], [2027.56, 205], [2027.64, 125], [2027.74, 175], [2027.86, 80]];
const TAO = 2027.92;                                // end of 2027
const DOOR = { x: 1500, w: 130, top: 650 };         // the hall door (workshop card F0; floor y 975)
const HERO = { x: S.MACH.x - S.MACH.r * 1.34, y: S.MACH.y + S.MACH.r * .02, s: S.MACH.r * .085 };   // the builder whose eye becomes the plate (machine card)
const CARDS = [
  { big: '9 OF 10', small: 'CODE CHANGES' },
  { big: '≈ 30,000', small: 'AGENTS AT ONCE' },
  { big: 'AS WELL AS', big2: 'A SKILLED HUMAN', small: 'EXPERIMENTS' },
  { big: '<1 % → 26 %', small: 'RESEARCH LED BY THE MODEL' },
  { big: '≈ 1.9×', small: 'ON BENCHMARKS' },
];
const CW = 300, CG = 26, CX0 = (W - (5 * CW + 4 * CG)) / 2, CY = 380, CH = 250;

// ------------------------------------------------------------------------------------------------ small local helpers
const lerpCam = (p, q, u) => E.cam3({ x: lerp(p.x, q.x, u), y: lerp(p.y, q.y, u), z: lerp(p.z, q.z, u), f: p.f });
function sink(ctx, t, k, fn, dist = 760) {   // draw fn shifted down by k (0..1) behind the subtitle line (a mask: things leave by moving)
  if (k >= 1) return; ctx.save(); F.float(ctx, t, 1); ctx.beginPath(); ctx.rect(0, 0, W, 880); ctx.clip(); ctx.translate(0, sineIO(k) * dist); fn(); ctx.restore();
}
function zoomAt(ctx, x0, y0, x1, y1, s) { ctx.translate(x1, y1); ctx.scale(s, s); ctx.translate(-x0, -y0); }
function txt(ctx, s, x, y, size, u, o = {}) {   // a sans caps line rising behind its mask
  if (u <= 0) return; const tw = measure(s, size, false, 600) + s.length * size * (o.sp ?? .1);
  maskLine(ctx, [[s, 0]], o.align === 'center' ? x - tw / 2 : o.align === 'right' ? x - tw : x, y, size, rise(u), { serif: false, weight: 600, col: o.col ?? P.cream, glow: false, spacing: o.sp ?? .1 });
}
// a cool marker on the rail (the forecasters' dots, as F.forecast draws them): rises out of the rail (k 0 → 1)
function marker(ctx, x, dy, k, o = {}) {
  if (k <= 0) return; const my = TL.y - dy * expoOut(k);
  ctx.save(); ctx.fillStyle = rgba(COOL.line, .7); ctx.fillRect(x - 1, my, 2, TL.y - my);
  E.halo(ctx, x, my, 30 * (o.r ?? 1), .5, COOL.halo, COOL.core); ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(x, my, 9 * (o.r ?? 1), 0, TAU); ctx.fill(); ctx.restore();
  return my;
}
// a tray (night card with a coloured edge and a lip)
function tray(ctx, x, y, w, h, u, col) {
  if (u <= 0) return; const k = expoOut(clamp(u));
  ctx.save(); ctx.globalAlpha *= clamp(u * 4); ctx.translate(0, (1 - k) * 50);
  ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(x + 6, y + 12, w, h, 14); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill();
  ctx.strokeStyle = rgba(col, .75); ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = rgba(col, .85); ctx.fillRect(x + 24, y + h - 10, w - 48, 4);
  E.halo(ctx, x + w / 2, y + h - 8, w * .45, .12, col, col);
  ctx.restore();
}
// the hero builder at the ring (machine card coords), drawn like F.builders but a little larger; eye = 0..1 extra glow
function heroBuilder(ctx, t, eye) {
  const { x, y, s } = HERO, bob = Math.sin(t * 1.3) * s * .15, tx = S.MACH.x + (x - S.MACH.x) * .8, ty = S.MACH.y + (y - S.MACH.y) * .8;
  ctx.strokeStyle = mixHex(P.ind2, P.blue2, .6); ctx.lineWidth = s * .35; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y + bob); ctx.lineTo(tx, ty); ctx.stroke();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.arc(x, y + bob, s, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(FORGE.line, .45); ctx.lineWidth = Math.max(1, s * .1); ctx.stroke();
  E.halo(ctx, x, y + bob, s * (2.4 + 2 * eye), .4 + .4 * eye, FORGE.halo, FORGE.hot);
  ctx.fillStyle = FORGE.hot; ctx.beginPath(); ctx.arc(x, y + bob, s * (.34 + .12 * eye), 0, TAU); ctx.fill();
  const fl = clamp(Math.sin(t * 7.3) * 1.4 + .2); if (fl > 0) E.halo(ctx, tx, ty, s * 2.2, .6 * fl, FORGE.halo, FORGE.core);
  return [x, y + bob, s * (.34 + .12 * eye)];
}

// ------------------------------------------------------------------------------------------------ the scene
function scene(a, T) {
  const T0 = a.t0, T1 = a.end, tIn = T0 + S.SEAM_HALF, tPlate = T1 - S.SEAM_HALF, tCreep = tPlate - 2.6;
  // ---------------------------------------------------------------- the camera (one take)
  const creepIn = (t) => { const k = 1 + S.CREEP * (t - (T0 - S.SEAM_HALF)); return S.WIDE_CAM(k, S.trk(k) * .4); };
  const creepOut = (t) => { const k = 1 + S.CREEP * (t - tPlate); return S.MACH_CAM(k, S.trk(k) * .3); };
  const K = [
    [tIn + .4, creepIn(tIn + .4)],
    [a.indep + .4, E.aim(F.F0, 1180, 800, 1.25)], [a.est - .2, E.aim(F.F0, 1170, 805, 1.3)],
    [a.est + 2.6, HALL(980, 470, .86)], [a.pub - .3, HALL(1040, 400, .9)], [a.say + .5, HALL(1060, 390, .93)],
    [a.group, HALL(1000, 430, .9)], [a.marks - .2, HALL(1020, 400, .94)],
    [a.marks + 2.4, MACH(1100, 300, 1.0)], [a.tao - .2, MACH(1110, 270, 1.06)],
    [a.c1a - .4, MACH(HERO.x + 300, HERO.y + 40, 1.6)], [a.c1aE, MACH(HERO.x + 320, HERO.y + 45, 1.72)],
    [a.onept + 3, MACH(1000, 300, 1.05)], [a.rung3, MACH(1050, 280, 1.0)], [a.neutral, MACH(1150, 260, 1.05)],
  ];
  const KALL = [...K, [tCreep, creepOut(tCreep)]];
  const camRaw = (t) => {
    if (t >= tCreep) return creepOut(t);
    const p = F.camPath(t, KALL); const u = smooth(span(t, tIn, tIn + 2.2));   // continue the plate's creep, then hand over to the path
    return u < 1 ? lerpCam(creepIn(t), p, u) : p;
  };
  const cam = (t) => E.camDrift(camRaw(t), t, smooth(span(t, tIn, tIn + 2)) * (1 - smooth(span(t, tPlate - 2.2, tPlate))), 7);

  // ---------------------------------------------------------------- world state
  const build = (t) => lerp(.72, .94, smooth(span(t, a.group, a.cond)));
  const glow = (t) => lerp(1, 1.15, smooth(span(t, a.split - 1, tPlate))) + .35 * F.bump(t, a.sai - .4, 1.6) + .25 * F.bump(t, a.design - .2, 1.4);
  const veilA = (t) => {
    const on1 = sineIO(span(t, a.est - .5, a.est + .9)) * (1 - .55 * sineIO(span(t, a.pub - .2, a.pub + 1.2))) ;
    const back1 = .55 * sineIO(span(t, a.say - .7, a.say + .5));   // after the tag the veil closes again
    const v1 = Math.min(1, on1 + back1) * (1 - sineIO(span(t, a.marks + .3, a.marks + 2.3)));
    const v2 = .62 * sineIO(span(t, a.c1a - 1.4, a.c1a + .4)) * (1 - sineIO(span(t, a.c1aE + .2, a.c1aE + 1.4)));   // behind the plate
    const v3 = sineIO(span(t, a.c1aE + .2, a.c1aE + 1.6)) * (1 - sineIO(span(t, a.split + 1.6, tPlate - .2)));
    const dip = 1 - .4 * sineIO(span(t, a.believe - 1, a.believe + 1)) * (1 - sineIO(span(t, a.check, a.check + 1.6)));   // the foundry shows between ladder and scorecard
    return .84 * Math.max(v1, v3 * dip) + v2 * (1 - v3);
  };
  // ---------------------------------------------------------------- explainer phases
  const gU = (t) => span(t, a.est - .1, a.est + 1.3);
  const gP = (t) => span(t, a.twice - .9, a.twice + 1.2);                        // the needle lands on "twice"
  const gShrink = (t) => sineIO(span(t, a.look - .2, a.look + 1.8));            // the gauge flies into card 5
  const barU = (t) => span(t, a.most - .1, a.most + 1.0), barP = (t) => sineIO(span(t, a.work - .3, a.work + 1.2));
  const cardsU = (i, t) => span(t, a.look + .3 + i * .18, a.look + 1.4 + i * .18);
  const cardsOut = (t) => span(t, a.pub - .3, a.pub + 1.3);
  const tagU = (t) => span(t, a.pub + .6, a.pub + 1.8) * (1 - span(t, a.say - .4, a.say + .5));
  const repU = (t) => span(t, a.say - .1, a.say + 1.2), repOut = (t) => span(t, a.crit - .7, a.crit + 1.9);
  const barsU = (t) => span(t, a.crit + 1.4, a.crit + 2.4), barsOut = (t) => span(t, a.ev - .3, a.ev + 1.3);
  const trayU = (t) => span(t, a.ev + 1.0, a.ev + 2.1), trayOut = (t) => span(t, a.group - .2, a.group + 1.4);
  const calU = (t) => span(t, a.group + .5, a.group + 1.6), fold = (t) => sineIO(span(t, a.cal - .2, a.cal + 1.6));
  const railU = (t) => span(t, a.cal + .7, a.cal + 2.4);
  const tlOut = (t) => span(t, a.marks - .3, a.marks + 1.6);
  const tlBack = (t) => 1 - span(t, a.c1bE + .3, a.c1bE + 2.1);                   // 9.03: the timeline rises again (as k)
  const tlOut2 = (t) => span(t, a.rung3 - .4, a.rung3 + 1.2);
  // ---------------------------------------------------------------- the timeline (8.01–8.05 and again 9.03)
  function timeline(ctx, t, second) {
    const tagU2 = second ? 1 : span(t, a.ai27 - .2, a.ai27 + .9);
    F.forecast(ctx, t, TL.x, TL.y, TL.w, { u: second ? 1 : railU(t), now: 2026.88, band: BAND, bandU: second ? 1 : span(t, a.same - .5, a.same + .6), y0: TL.y0, y1: TL.y1 });
    // the AI 2027 card, pinned to the rail at April 2025
    if (tagU2 > 0) {
      const px = X(2025.28), cb = 480 + (1 - expoOut(tagU2)) * 40; ctx.save(); ctx.globalAlpha *= clamp(tagU2 * 3); ctx.fillStyle = rgba(P.cream, .5); ctx.fillRect(px - 1, cb, 2, TL.y - cb); ctx.restore();
      F.paperCard(ctx, t, 250, 320, 360, 160, { u: tagU2, head: 'A SCENARIO (APRIL 2025)', headSize: 17, lines: [['AI 2027', 62]], rot: -.012 });
    }
    // Kokotajlo: rises at END 2028, slides to MAY 2027 (a dashed trail stays)
    const kk = second ? 1 : span(t, a.koko - .2, a.koko + .8), kp = second ? 1 : sineIO(span(t, a.may - .25, a.may + 1.1));
    if (kk > 0) {
      const nudge = second ? 0 : .08 * F.bump(t, a.out - .1, .9);   // anticipation: a small move the wrong way as the report lands
      const v = lerp(KOKO.from + nudge, KOKO.to, kp), xx = X(v), my = TL.y - KOKO.dy;
      if (kp > 0) { ctx.save(); ctx.setLineDash([6, 6]); ctx.strokeStyle = rgba(P.cream, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(KOKO.from), my); ctx.lineTo(xx, my); ctx.stroke(); ctx.restore();
        ctx.strokeStyle = rgba(P.cream, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(KOKO.from), my, 8, 0, TAU); ctx.stroke(); }
      marker(ctx, xx, KOKO.dy, kk);
      txt(ctx, 'KOKOTAJLO', xx, my - 58, 24, second ? 1 : span(t, a.koko, a.koko + .7), { align: 'center' });
      const s28 = second ? 0 : span(t, a.end28 - .1, a.end28 + .6) * (1 - span(t, a.may - .3, a.may + .1));
      if (s28 > 0) txt(ctx, 'END 2028 (AUG 2026)', xx, my - 30, 18, s28, { align: 'center', col: P.halo2, sp: .14 });
      const s27 = second ? 1 : span(t, a.may + .7, a.may + 1.3);
      if (s27 > 0) txt(ctx, 'MAY 2027', xx, my - 30, 20, s27, { align: 'center', col: COOL.text, sp: .14 });
    }
    // the five others land in the same year
    FIVE.forEach(([v, dy], i) => marker(ctx, X(v), dy, second ? 1 : span(t, a.team + .1 + i * .16, a.team + .9 + i * .16), { r: .8 }));
    const al = second ? 0 : span(t, a.same - .2, a.same + .6);
    if (al > 0) F.goldText(ctx, [['ALL SIX MEDIANS: MAY–NOV 2027', .2]], X(2027.62), TL.y + 120, 26, rise(al), { serif: false, weight: 600, spacing: .1, align: 'center' });
    // the gauge card drops onto the rail as the report comes out
    if (!second) {
      const gd = span(t, a.then + .1, a.out + .2), gx = 1340, gw = 300, gh = 230;
      if (gd > 0) { const y = lerp(-gh - 40, TL.y - 16 - gh, sineIO(gd)) + 5 * F.bump(t, a.out + .2, .35);
        F.dataCard(ctx, t, gx, y, gw, { u: 1, h: gh, kind: 'ESTIMATE', title: 'METR, NOV 5, 2026', big: '≈ 1.9×', bigSize: 64, small: 'ON BENCHMARKS' }); }
    }
  }

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t < tIn) { S.plateClimb(ctx, t, T); return; }
    if (t >= tPlate) { S.plateMachine(ctx, t, T); return; }
    const c = cam(t);
    let heroEye = null;
    const evIn = (i) => span(t, T0 + .3 + i * .5, T0 + 3.6 + i * .5);
    const out = S.foundry(ctx, c, t, {
      lamp: 1, hall: .5, carts: .6, ladder: { state: S.CLIMB },
      machine: { build: build(t), glow: glow(t) },
      extra: (hx) => {   // 7.01: the hall door (cool light) and the three evaluators stepping in (they stay, small, by the ladder)
        const du = smooth(span(t, T0 - .2, a.ask + .2)) * (1 - .6 * smooth(span(t, a.est, a.est + 3))), d = DOOR, F_ = S.FLOOR;
        hx.save(); hx.fillStyle = mixHex(P.night1, P.ind1, .55); hx.fillRect(d.x - 16, d.top - 16, d.w + 32, F_ - d.top + 16);
        hx.fillStyle = E.lin(hx, 0, d.top, 0, F_, [[0, rgba(COOL.body, .2 + .5 * du)], [1, rgba(COOL.halo, .1 + .35 * du)]]); hx.fillRect(d.x, d.top, d.w, F_ - d.top);
        hx.fillStyle = rgba(COOL.halo, .12 * du); hx.beginPath(); hx.moveTo(d.x, F_); hx.lineTo(d.x + d.w, F_); hx.lineTo(d.x + d.w + 60, F_ + 70); hx.lineTo(d.x - 320, F_ + 70); hx.closePath(); hx.fill();
        E.halo(hx, d.x + d.w / 2, d.top + 140, 220, .22 * du, COOL.halo, COOL.core);
        for (let i = 0; i < 3; i++) {
          const u = sineIO(evIn(i)); if (u <= 0) continue;
          const x = lerp(d.x + d.w * .5, 1020 + i * 95, u), walking = u < .985, hh = 146 - i * 5;
          E.person(hx, x, F_, hh, { dir: -1, light: .7, rim: COOL.line, walk: walking ? t * 7 + i * 2 : undefined, long: i === 1 });
          hx.fillStyle = COOL.core; hx.fillRect(x - 12, F_ - hh * .66, 8, 10);   // the badge
        }
        hx.restore();
      },
      front: (mx, mc) => {
        // 7.05: the tag IPO · THIS WEEK drops from the ring; "Speed sells": it turns over to $
        const tu = tagU(t);
        if (tu > 0) {
          const tx = S.MACH.x + S.MACH.r * .55, ty = S.MACH.y + S.MACH.r * .82, fl = span(t, a.sells - .15, a.sells + .45), sx = Math.cos(Math.PI * fl);
          mx.save(); mx.translate(tx, 0); mx.scale(Math.abs(sx) < .02 ? .02 : sx, 1); mx.translate(-tx, 0);
          F.priceTag(mx, t, tx, ty, fl < .5 ? ['IPO', 'THIS WEEK'] : ['$'], tu, { len: 190, size: 34 });
          mx.restore();
        }
        // 8.06: the builder whose eye becomes the plate
        heroEye = heroBuilder(mx, t, span(t, a.tao, a.c1a - 1.4) * (1 - span(t, a.c1a + 1, a.c1a + 3)));
      },
    });
    const veil = veilA(t);
    F.veil(ctx, veil);
    // 7.01: the evaluators' card
    {
      const u = span(t, a.indep - .1, a.indep + 1.0) * (1 - span(t, a.est - .5, a.est + .3));
      if (u > 0) { ctx.save(); F.float(ctx, t, .6);
        F.paperCard(ctx, t, 150, 330, 700, 240, { u, head: 'INDEPENDENT EVALUATORS (METR)', headSize: 20, lines: [['Inside Anthropic', 50], ['“Anthropic can’t veto publication.”', 34]] });
        ctx.restore(); }
    }
    // 7.02 / 7.03 / 7.04: the gauge → the share bar → card 5
    const gu = gU(t), gs = gShrink(t);
    if (gu > 0 && gs < 1) {
      ctx.save(); F.float(ctx, t, 1);
      const cx5 = CX0 + 4 * (CW + CG) + CW / 2, cy5 = CY + CH / 2;
      zoomAt(ctx, 760, 560, lerp(760, cx5, gs), lerp(560, cy5, gs), lerp(1, .32, gs));
      ctx.globalAlpha *= 1 - span(gs, .75, 1);
      F.gauge(ctx, t, 760, 640, 300, { u: gu, p: gP(t), v: 1.9, range: [1.5, 2.8], label: 'ON BENCHMARKS', sub: 'INDEPENDENT EVALUATORS (METR)' });
      // the share bar (the band splits): ≈ 80 % gold from A.I. at work, the rest cream: people in the loop
      const bu = barU(t);
      if (bu > 0) {
        const bx = 1180, by = 470, bw = 600, bh = 46, bp = barP(t), k = expoOut(bu);
        ctx.save(); ctx.globalAlpha *= clamp(bu * 4);
        ctx.fillStyle = rgba(P.cream, .14); ctx.fillRect(bx, by, bw * k, bh);
        ctx.fillStyle = E.lin(ctx, bx, 0, bx + bw, 0, [[0, FORGE.hot], [1, FORGE.body]]); ctx.fillRect(bx, by, bw * .8 * bp * k, bh);
        if (bp > 0) E.halo(ctx, bx + bw * .4 * bp, by + bh / 2, bw * .4, .18 * bp, FORGE.halo, FORGE.hot);
        const lu = span(t, a.loop - .2, a.loop + .6); if (lu > 0) { ctx.fillStyle = mixHex(P.halo2, P.cream, .6); ctx.fillRect(bx + bw * .8, by, bw * .2 * expoOut(lu), bh); }
        ctx.restore();
        F.goldText(ctx, [['≈ 80 %', 1]], bx, by - 34, 72, rise(span(t, a.work - .2, a.work + .7)), { serif: true });
        txt(ctx, 'FROM A.I. AT WORK', bx, by + bh + 46, 24, span(t, a.work, a.work + .8), { col: FORGE.text });
        txt(ctx, 'HUMANS IN THE LOOP', bx + bw, by + bh + 46, 24, span(t, a.loop - .1, a.loop + .7), { col: P.cream, align: 'right' });
      }
      ctx.restore();
    }
    F.source(ctx, t, a.bench, a.most, F.SOURCES.metr);
    F.source(ctx, t, a.most + .2, a.look, F.SOURCES.metrShare);
    // 7.04: five numbers, each from the lab
    const co = cardsOut(t);
    if (cardsU(0, t) > 0 && co < 1) sink(ctx, t, co, () => {
      CARDS.forEach((cd, i) => {
        const u = i === 4 ? span(gs, .55, 1) : cardsU(i, t); if (u <= 0) return;
        const x = CX0 + i * (CW + CG);
        F.paperCard(ctx, t, x, CY, CW, CH, { u, style: 'night' });
        ctx.save(); ctx.translate(0, (1 - expoOut(u)) * 40);
        if (cd.big2) { F.goldText(ctx, [[cd.big, 1]], x + CW / 2, CY + 100, 40, rise(span(u, .3, 1)), { serif: true, align: 'center' }); F.goldText(ctx, [[cd.big2, 1]], x + CW / 2, CY + 146, 34, rise(span(u, .35, 1)), { serif: true, align: 'center' }); }
        else F.goldText(ctx, [[cd.big, 1]], x + CW / 2, CY + 132, cd.big.length > 8 ? 50 : 66, rise(span(u, .3, 1)), { serif: true, align: 'center' });
        txt(ctx, cd.small, x + CW / 2, CY + 196, 17, span(u, .4, 1), { align: 'center', col: P.halo2, sp: .12 });
        ctx.restore();
        const st = i === 4 ? a.hands + .1 : a.labs - .1 + i * .22;
        F.stamp(ctx, t, 'SOURCE: THE LAB', x + CW / 2, CY + CH + 4, { t0: st, size: 22, rot: -.07 + .03 * (i % 2), ink: mixHex(P.cream, FORGE.hot, .3) });
      });
    });
    F.source(ctx, t, a.labs, a.pub, F.SOURCES.labReports);
    // 7.06: the report, most lines blacked out
    const ru = repU(t), ro = repOut(t);
    if (ru > 0 && ro < 1) sink(ctx, t, ro, () => {
      const x = 400, y = 250, w = 470, h = 600;
      F.paperCard(ctx, t, x, y, w, h, { u: ru, head: F.SOURCES.redacted, headSize: 17, rot: .01 });
      ctx.save(); ctx.translate(x + w / 2, y + h / 2 + (1 - expoOut(ru)) * 40); ctx.rotate(.01); ctx.translate(-w / 2, -h / 2);
      const rnd = E.prng(76);
      for (let l = 0; l < 15; l++) {
        const lw = (w - 80) * (.55 + rnd() * .45), ly = 92 + l * 33, lu = clamp(ru * 2 - .5 - l * .04); if (lu <= 0) continue;
        ctx.fillStyle = rgba(PAPER.faint, .55); ctx.fillRect(40, ly, lw * expoOut(lu), 7);
        if (l !== 2 && l !== 9 && l !== 13) {   // most of them go black, one after the other, on "blacked out"
          const bk = span(t, a.black - .2 + l * .07, a.black + .25 + l * .07);
          if (bk > 0) { ctx.fillStyle = PAPER.ink; ctx.fillRect(36, ly - 9, (lw + 8) * expoOut(bk), 24); }
        }
      }
      ctx.restore();
      F.quoteCard(ctx, t, T, { u: span(t, a.black + .3, a.black + 1.4), text: '“Anthropic redacted a majority of the evidence we found most informative …”', x: 960, y: 330, w: 820, size: 46, credit: F.SOURCES.redacted });
    }, 650);
    // 7.07: the bill: 6.19× the spending for 1.91× the pace
    const bsu = barsU(t), bso = barsOut(t);
    if (bsu > 0 && bso < 1) sink(ctx, t, bso, () => {
      const base = 760, per = 62, cols = [[560, 6.19, 'SPENDING', a.six, P.cream], [920, 1.91, 'PACE', a.speed2, FORGE.body]];
      ctx.save(); ctx.globalAlpha *= clamp(bsu * 4); ctx.fillStyle = rgba(P.cream, .5); ctx.fillRect(400, base, 760 * expoOut(bsu), 2.5); ctx.restore();
      for (const [x, v, lab, at, col] of cols) {
        const g = sineIO(span(t, at - .3, at + 1.3)), hh = v * per * g, bw = 200;
        txt(ctx, lab, x + bw / 2, base + 44, 24, bsu, { align: 'center' });
        if (g <= 0) continue;
        ctx.fillStyle = col === P.cream ? mixHex(P.halo2, P.cream, .55) : E.lin(ctx, 0, base - hh, 0, base, [[0, FORGE.hot], [1, FORGE.body]]); ctx.fillRect(x, base - hh, bw, hh);
        if (col !== P.cream) E.halo(ctx, x + bw / 2, base - hh / 2, bw, .2 * g, FORGE.halo, FORGE.hot);
        F.goldText(ctx, [[`${v.toFixed(2)}×`, col === P.cream ? 0 : 1]], x + bw / 2, base - hh - 22, 60, rise(span(g, .55, 1)), { serif: true, align: 'center' });
      }
      F.paperCard(ctx, t, 1260, 420, 520, 170, { u: span(t, a.speed2 + .4, a.speed2 + 1.4), lines: [['“nothing causal can be inferred”', 36]], src: 'IMAS & GARICANO', rot: -.015 });
    });
    F.source(ctx, t, a.six, a.ev, F.SOURCES.spend);
    // 7.08: two trays: what the evidence supports, what is still a fight
    const tu = trayU(t), to = trayOut(t);
    if (tu > 0 && to < 1) sink(ctx, t, to, () => {
      const lu = span(t, a.real - .2, a.real + .7), fu = span(t, a.big - .3, a.big + .7);
      tray(ctx, 240, 380, 660, 300, tu, FORGE.body); tray(ctx, 1020, 380, 660, 300, span(tu, .15, 1), COOL.line);
      if (lu > 0) { F.goldText(ctx, [['LOOKS REAL', 1]], 570, 560, 88, rise(lu), { serif: true, align: 'center' }); E.halo(ctx, 570, 520, 300, .14 * lu, FORGE.halo, FORGE.hot); }
      txt(ctx, 'HOW BIG?', 1070, 470, 30, fu, { col: COOL.text });
      txt(ctx, 'HOW MUCH IS THE MACHINE?', 1070, 520, 30, span(t, a.much - .2, a.much + .7), { col: COOL.text });
      const of = span(t, a.fight - .2, a.fight + .6);
      if (of > 0) F.goldText(ctx, [['OPEN FIGHT', 0]], 1350, 630, 74, rise(of), { serif: true, align: 'center', col: COOL.core });
    });
    // 8.01: the calendar page tears and folds flat into the rail
    const cu = calU(t), fo = fold(t);
    if (cu > 0 && fo < 1) {
      ctx.save(); F.float(ctx, t, 1);
      const pw = 340, ph = 400, px = W / 2 - pw / 2, k = expoOut(cu), sy = Math.cos(fo * Math.PI / 2);
      ctx.translate(0, (1 - k) * 60); ctx.globalAlpha *= clamp(cu * 4);
      ctx.translate(W / 2, TL.y); ctx.scale(1 + fo * .2, Math.max(.004, sy)); ctx.rotate(-.05 * fo); ctx.translate(-W / 2, -TL.y);
      ctx.fillStyle = E.lin(ctx, 0, TL.y - ph, 0, TL.y, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(px, TL.y - ph, pw, ph, 6); ctx.fill();
      ctx.fillStyle = mixHex(PAPER.ink, FORGE.deep, .3); ctx.fillRect(px, TL.y - ph, pw, 90);
      for (let i = 0; i < 6; i++) { ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(px + 40 + i * 52, TL.y - ph + 12, 7, 0, TAU); ctx.fill(); }
      E.glowText(ctx, 'NOV', W / 2, TL.y - ph + 70, { size: 46, weight: 600, spacing: .2, align: 'center', col: PAPER.lit, glow: false });
      E.glowText(ctx, '2026', W / 2, TL.y - 120, { size: 120, serif: true, align: 'center', col: PAPER.ink, glow: false });
      // the tear line along the bottom
      ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.moveTo(px, TL.y - 6); ctx.lineTo(px + pw, TL.y - 6); ctx.stroke();
      ctx.restore();
    }
    // 8.01–8.05: the timeline
    const tlo = tlOut(t);
    if (railU(t) > 0 && tlo < 1) sink(ctx, t, tlo, () => timeline(ctx, t, false));
    F.source(ctx, t, a.same - .2, a.marks + .4, F.SOURCES.sixMedians);
    // 8.05: the band flies into the core; label at the core
    const mAt = S.machineAt(c);
    {
      const fu = sineIO(span(t, a.marks - .1, a.marks + 1.9));
      if (fu > 0 && fu < 1 && mAt) {
        const bx0 = X(BAND[0]), bx1 = X(BAND[1]), x = lerp((bx0 + bx1) / 2, mAt[0], fu), y = lerp(TL.y - 20 + E.drift(t * 2, 10, 17), mAt[1], fu), w = lerp(bx1 - bx0, 60, fu), h = lerp(100, 60, fu);
        ctx.save(); ctx.globalAlpha *= 1 - span(fu, .8, 1); ctx.fillStyle = rgba(COOL.halo, .22 + .3 * fu); ctx.strokeStyle = rgba(COOL.line, .85);
        ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, lerp(0, 30, fu)); ctx.fill(); ctx.stroke(); ctx.restore();
      }
      const lu = span(t, a.sai - .3, a.sai + .7) * (1 - span(t, a.tao - .3, a.tao + .5));
      if (lu > 0 && mAt) F.goldLabel(ctx, mAt[0] + mAt[2] * .25, mAt[1] + mAt[2] * .3, 'A SUPERHUMAN A.I. RESEARCHER', '', lu, { dx: 130, dy: 150, size: 30 });
    }
    const lg = sineIO(span(t, a.rung3 + .3, a.rung3 + 2.2)) * (1 - sineIO(span(t, a.believe - 1.6, a.believe + .3)));
    F.ladderHUD(ctx, t, T, { a: 1 - lg });
    // 8.06–9.03: the clip plate (grows from the builder's eye, steps back, grows again, shrinks into the pin)
    let eyeScr = null;
    if (heroEye) { const p = E.project(c, S.Z_MACH, heroEye[0], heroEye[1]); if (p) eyeScr = [p[0], p[1], Math.max(6, heroEye[2] * p[2])]; }
    const SMALL = { x: 150, y: 330, w: 820, h: 461 }, pinXY = [X(TAO), TL.y + (1 - expoOut(clamp(tlBack(t)))) * 0, 8];
    {
      const grow1 = span(t, a.c1a - 1.5, a.c1a + .3), back = span(t, a.c1aE + .05, a.c1aE + 1.85), grow2 = span(t, a.c1b - 1.5, a.c1b + .3), shrink = span(t, a.c1bE + .15, a.c1bE + 1.95);
      if (grow1 > 0 && shrink < 1) {
        let from, morph;
        if (t < a.c1aE + .05) { from = eyeScr ?? [960, 300, 10]; morph = grow1; }
        else if (shrink <= 0) { from = SMALL; morph = clamp(1 - back + grow2); }
        else { from = pinXY; morph = 1 - shrink; }
        const dark = shrink > 0 ? .7 * span(t, a.c1bE + .3, a.c1bE + 1.5) : .45 * span(t, a.c1aE, a.c1aE + 1.2) * (1 - span(t, a.c1b - 1.5, a.c1b));
        if (morph > .002 || from === SMALL) F.clipPlate(ctx, t, T, t < a.onept ? 'T1a' : 'T1b', { from, morph, dark });
      }
    }
    // 9.01: 1.3 YEARS? · TIMELINES TO WHAT?
    {
      const t13 = Math.max(a.onept, a.c1aE + 1.4), u = span(t, t13 - .1, t13 + .9), o = span(t, a.c1b - 1.6, a.c1b - .2);
      if (u > 0 && o < 1) sink(ctx, t, o, () => {
        F.goldText(ctx, [['1.3 YEARS?', 1]], 1100, 540, 130, rise(u), { serif: true });
        txt(ctx, 'TIMELINES TO WHAT?', 1108, 620, 34, span(t, a.tlw - .1, a.tlw + .7));
      });
    }
    // 9.03: the timeline again, Tao Lin's pin at END 2027
    const tb = tlBack(t), to2 = tlOut2(t);
    if (t > a.c1bE + .3 && to2 < 1) {
      sink(ctx, t, Math.max(clamp(tb), to2), () => {
        timeline(ctx, t, true);
        const pu = span(t, a.c1bE + 1.9, a.c1bE + 2.6);
        if (pu > 0) { const xx = X(TAO), py = TL.y + 130 - (1 - expoOut(pu)) * 30; ctx.fillStyle = rgba(P.cream, .5); ctx.fillRect(xx - 1, TL.y + 12, 2, (py - TL.y - 40) * expoOut(pu));
          txt(ctx, 'TAO LIN', xx, py, 24, pu, { align: 'center' }); txt(ctx, 'END 2027', xx, py + 30, 18, span(pu, .3, 1), { align: 'center', col: P.halo2, sp: .14 }); }
        if (pu > 0) { const xx = X(TAO); E.halo(ctx, xx, TL.y, 70, .5 * F.bump(t, a.c1bE + 1.9, 1.2) + .15, FORGE.halo, FORGE.hot); ctx.fillStyle = FORGE.hot; ctx.beginPath(); ctx.arc(xx, TL.y, 8, 0, TAU); ctx.fill(); }
      });
    }
    F.source(ctx, t, a.insider - .1, a.rung3, F.SOURCES.taoView);
    // 9.04: the HUD grows big (rung 3 FORECAST), machines building machines
    if (lg > 0) {
      const L = F.ladderState(T, t), x = lerp(108, 640, lg), y = lerp(290, 820, lg), h = lerp(210, 560, lg), w = lerp(58, 150, lg);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      F.ladder(ctx, t, x, y, h, { w, state: L.state, lit: L.lit, labels: span(lg, .6, 1), tags: L.tags, size: 26, marker: 2.4 });
      ctx.restore();
      const gc = span(t, a.design - .8, a.design + .6);
      if (gc > 0) { ctx.save(); F.float(ctx, t, 1); ctx.globalAlpha *= 1 - span(t, a.believe - 1.2, a.believe); F.genChain(ctx, t, 1120, 520, 640, { u: gc, p: lerp(0, 2, sineIO(span(t, a.design, a.design + 2))), radii: [42, 64, 96] }); ctx.restore(); }
    }
    // 9.05 / 9.06: the scorecard and the tag
    {
      const u = span(t, a.check + .2, a.check + 1.3), o = span(t, a.cond - .3, a.cond + 1.3);
      if (u > 0 && o < 1) sink(ctx, t, o, () => {
        const x = 520, y = 290, w = 880, h = 400;
        F.paperCard(ctx, t, x, y, w, h, { u, head: 'AI 2027', headSize: 18, rot: -.008, src: F.SOURCES.record });
        ctx.save(); ctx.translate(x + w / 2, y + h / 2 + (1 - expoOut(u)) * 40); ctx.rotate(-.008); ctx.translate(-w / 2, -h / 2);
        const rows = [['A.I. HELPS BUILD A.I.', a.right - .2, true, a.helps], ['STOCKS UP 30 %', a.stocks - .1, false, a.neither], ['MASS PROTESTS', a.protests - .1, false, a.neither + .25]];
        rows.forEach(([s, at, ok, mk], i) => {
          const ry = 130 + i * 84, ru = span(t, at, at + .7); if (ru <= 0) return;
          maskLine(ctx, [[s, 0]], 140, ry + 15, 42, rise(ru), { serif: false, weight: 600, col: PAPER.ink, glow: false, spacing: .06 });
          const m = span(t, mk - .05, mk + .3); if (m <= 0) return;
          ctx.save(); ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.strokeStyle = ok ? FORGE.shade : mixHex(PAPER.ink, COOL.deep, .5); ctx.beginPath();
          if (ok) { const p1 = [62, ry], p2 = [80, ry + 18], p3 = [112, ry - 22]; ctx.moveTo(...p1); if (m < .4) ctx.lineTo(lerp(p1[0], p2[0], m / .4), lerp(p1[1], p2[1], m / .4)); else { ctx.lineTo(...p2); const q = (m - .4) / .6; ctx.lineTo(lerp(p2[0], p3[0], q), lerp(p2[1], p3[1], q)); } }
          else { const q1 = clamp(m * 2), q2 = clamp(m * 2 - 1); ctx.moveTo(66, ry - 18); ctx.lineTo(66 + 40 * q1, ry - 18 + 40 * q1); if (q2 > 0) { ctx.moveTo(106, ry - 18); ctx.lineTo(106 - 40 * q2, ry - 18 + 40 * q2); } }
          ctx.stroke(); ctx.restore();
        });
        ctx.restore();
        F.priceTag(ctx, t, x + w + 150, y - 30, ['THEY WANT', 'A PAUSE'], span(t, a.pause - .3, a.pause + .9), { len: 110, size: 32 });
      });
    }
    // 9.07: the condition
    {
      const u = span(t, a.cond + .9, a.cond + 2.0), o = span(t, a.split - .1, a.split + 1.5);
      if (u > 0 && o < 1) sink(ctx, t, o, () => {
        F.quoteCard(ctx, t, T, { u, text: '“…assuming no substantial deliberate slowdown”', x: (W - 1120) / 2, y: 300, w: 1120, size: 58, credit: F.SOURCES.slowdown.split(' · ')[1] });
      });
    }
    // 9.08: the rail splits at 2027: one branch runs up into the core, the other runs on flat; then both run out of the frame
    {
      const ru = span(t, a.split - .1, a.split + 1.1), sp = sineIO(span(t, a.two - .3, a.two + 1.2)), gone = sineIO(span(t, a.two + 1.2, tPlate - .3));
      if (ru > 0 && gone < 1 && mAt) {
        const y = 700, xs = X(2027), base = [[120, y], [xs, y]];
        const up = [[xs, y]]; for (let i = 1; i <= 16; i++) { const s = i / 16; up.push([lerp(xs, mAt[0], s), lerp(y, mAt[1], s * s)]); }
        const flat = [[xs, y], [W + 60, y]];
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lerp(120, xs, gone), y); ctx.lineTo(lerp(120, xs, expoOut(ru)), y); ctx.stroke();
        if (sp > 0) {
          F.goldSpan(ctx, up, gone, sp, { w: 3 });
          ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = rgba(P.cream, .75); ctx.lineWidth = 3; const fx0 = lerp(xs, W + 60, gone), fx1 = lerp(xs, W + 60, sp);
          if (fx1 > fx0) { ctx.beginPath(); ctx.moveTo(fx0, y); ctx.lineTo(fx1, y); ctx.stroke(); } ctx.restore();
        }
        txt(ctx, '2027', xs, y + 50, 26, ru * (1 - gone), { align: 'center', col: P.halo2 });
        ctx.restore();
      }
    }
  };
}
