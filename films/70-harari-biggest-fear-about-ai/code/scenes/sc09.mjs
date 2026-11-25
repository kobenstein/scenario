// c09 · THREE TESTS (B3) · 'Three tests' (plateAnvil) → C3 (the plate folds into the cow's hill line at 9.01, drawn by sc10's take).
// One take on THE TRUST BOARD. The anvil is home: each test is poured into its mould, then the view carries to the stations that show
// exactly its sentences, and comes back to the anvil for the next mould. No planned hard cut (shots.md: no W in c09).
//
// | ID   | anchor (phrase)            | zeigt wörtlich (what you see)                                                             | kind | carrier out            |
// |------|----------------------------|-------------------------------------------------------------------------------------------|------|------------------------|
// | 8.01 | Three tests                | plateAnvil: the anvil, three empty ring moulds; the four cracked links fly up into the HUD | EXPL | mould 1                |
// | 8.02 | The first: a human         | mould 1 fills with gold: A HUMAN ANSWERS FOR IT                                           | EXPL | the view carries right |
// | 8.03 | That guards you against    | a NO form, its arrow runs into a wall: DEAD END · NOBODY IS RESPONSIBLE; a gold ring runs | EXPL | the ground line        |
// |      |                            | in along the arrow and a person rises at its end                                          |      |                        |
// | 8.04 | Last year, Europe's highest| a woman, a phone contract, a line into an automatic score dial; the needle swings to       | EXPL | the dial               |
// |      |                            | REFUSED · EUROPE'S HIGHEST COURT (source CJEU C-203/22)                                    |      |                        |
// | 8.05 | Whoever decides by machine | the dial opens, an explanation sheet unfolds: MUST EXPLAIN · SO YOU CAN CONTEST; she raises her hand | EXPL | the sheet folds  |
// | 8.06 | But for hiring and         | the sheet folds into a line that falls and becomes a timeline: the marker HUMAN OVERSIGHT  | EXPL | the timeline runs left |
// |      |                            | slides AUG 2026 → DEC 2027 · POSTPONED TO DEC 2027 (source EU AI Act)                      |      |                        |
// | 8.07 | And a human only           | the analyst at her screen, the 86 % bar behind her, her lamp lights: ONLY IF THE JUDGMENT IS THEIRS | MIX | the view carries home |
// | 8.08 | The second: the machine    | mould 2 fills; a speech bubble rises out of it: I AM A MACHINE · IT SAYS WHAT IT IS        | EXPL | the bubble rises       |
// | 8.09 | That guards you against    | the bubble folds into a screen; a person shape in front of it slides off: the machine behind | MIX | the screen            |
// | 8.10 | Since August               | a date tag pins on: EU AI ACT, ARTICLE 50 · REQUIRED BY LAW                                | EXPL | the iris               |
// | 8.11 | A chatbot has to           | the iris opens into a chat window, its first line a tag: AI                                | EXPL | the person shape       |
// | 8.12 | Harari wants more          | the person shape is barred by a gold line: HARARI: BAN THE PRETENDERS                      | EXPL | home                   |
// | 8.13 | The third: somebody        | mould 3 fills; an examiner walks in from outside with a magnifier: SOMEONE OUTSIDE CAN CHECK | MIX | the examiner walks    |
// | 8.14 | That guards you against    | the maker's sealed box (81% RELY ON VENDOR ASSURANCES) is opened from outside; the model rises | MIX | the model           |
// | 8.15 | Britain runs a state       | the model on a test bench, 43 run lamps: UK AI SECURITY INSTITUTE · TESTS MODELS ITSELF    | EXPL | the lamps              |
// | 8.16★| This year its testers      | 9 of the 43 lamps flare: ONE MODEL: 9 OF 43 RUNS                                           | EXPL | the lamps              |
// | 8.17 | None of its attempts       | every lit lamp runs up into a closed gold gate: NO ATTEMPT SUCCEEDED                       | EXPL | two arrows             |
// | 8.18 | And the examiner found     | a gold arrow from the examiner to the lamps; the maker's dashed arrow stops short           | EXPL | home                   |
// | 8.19 | None of the three builds   | the three rings on the anvil cool down: NONE BUILDS ITSELF                                 | EXPL | the anvil sinks        |
// | 8.20 | Lawmakers can demand       | lawmakers rise and lift ring 1                                                             | MIX  | ring 2                 |
// | 8.21 | Labs can deliver           | lab workers lift ring 2                                                                    | MIX  | ring 3                 |
// | 8.22 | And you can ask            | you (yellow coat) lift ring 3                                                              | MIX  | the rings              |
// | 8.23–8.25 | Who answers / Is this / Who checked | each ring flattens into a question card                                  | EXPL | the cards              |
// | 8.26 | Not one of those           | behind the cards a closed dark machine rises: NONE REQUIRES UNDERSTANDING THE MACHINE      | EXPL | the cards turn         |
// | 8.27 | All three are about        | each card turns over and shows a person: ALL ABOUT PEOPLE                                  | MIX  | the cards              |
// | 8.28 | Harari ends up             | the cards turn back into rings, the rings link up; the linked rings grow into the clip frame | MIX | the frame            |
// | 8.29 | slot C3                    | C3 (lower third after 2.2 s: Suleyman listens first)                                       | CLIP | → sc10: the frame folds into the hill line |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f70_kit.mjs';
import * as S from '../lib/f70_world.mjs';
import * as X from '../lib/f70_explain.mjs';
import * as B from '../lib/b3_kit.mjs';
import { makeC10 } from './sc10.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, LAMP, SOURCES: SRC } = F;
const PR = F.PRINT70;
const TAU = Math.PI * 2;
const { lab } = B;

export default async (T, R) => {
  const g = (p) => T.G(p, 0, R.a);
  const A = {
    first: g('The first: a human'), human: g('a human answers'), guards1: g('That guards you against the dead'), dead: g('dead end'),
    nobody: g('nobody is responsible'), court: g("Last year, Europe's"), woman: g('a woman refused'), phone: g('phone contract'),
    auto: g('automatic score'), whoever: g('Whoever decides'), explain: g('explain the decision'), contest: g('contest it'),
    but: g('But for hiring'), oversight: g('human oversight'), postponed: g('postponed'), own: g('And a human only'), judgment: g('judgment is still'),
    second: g('The second: the machine'), says: g('machine says it'), guards2: g('That guards you against being'), pretends: g('pretends to be'),
    since: g('Since August'), chatbot: g('A chatbot has'), harari: g('Harari wants more'), ban: g('a ban on'),
    third: g('The third: somebody'), indep: g('somebody independent'), guards3: g("That guards you against having"), makerW: g("maker's word"),
    britain: g('Britain runs a state'), tests: g('tests these models'), thisYear: g('This year its testers'), caught: g('caught a model'),
    none: g('None of its attempts'), examiner: g('And the examiner found'), notMaker: g('not the maker'), builds: g('None of the three builds'),
    lawmakers: g('Lawmakers can demand'), labs: g('Labs can deliver'), youAsk: g('And you can ask'),
    q1: g('Who answers for this'), q2: g('Is this a machine'), q3: g('Who checked it'), notOne: g('Not one of those'), people: g('All three are about'),
    ends: g('Harari ends up'),
  };
  const C3 = T.clip('C3'), T0 = R.a, c10 = makeC10(T);
  const SWITCH = C3.start + 1.5;   // under the full-size clip plate the background hands over to sc10's take (identical view: V0)

  // ------------------------------------------------------------------------------------------------ the view
  // continue the plate's creep (4 %/s from T0 − .5) and let it settle (same velocity at T0 + .5, asymptote 1.08)
  const creepK = (t) => t <= T0 + .5 ? 1 + S.CREEP * (t - (T0 - S.SEAM_HALF)) : 1 + S.CREEP * (1 + (1 - Math.exp(-(t - T0 - .5))));
  const HOME = { x: 960, y: 540, s: 1 };
  const VB = [[T0, HOME], [A.first - .1, HOME], [A.first + 1.6, { x: 830, y: 560, s: 1.08 }],
    [A.guards1 - .2, { x: 840, y: 560, s: 1.09 }], [A.guards1 + 1.7, { x: 2260, y: 540, s: .98 }], [A.court - .2, { x: 2275, y: 545, s: 1.0 }],
    [A.court + 1.6, { x: 2240, y: 1440, s: 1.02 }], [A.but - .3, { x: 2250, y: 1445, s: 1.05 }],
    [A.but + 1.8, { x: 2340, y: 2230, s: .93 }], [A.own - .3, { x: 2330, y: 2232, s: .95 }],
    [A.own + 1.4, { x: 1380, y: 2190, s: 1.12 }], [A.second - .5, { x: 1375, y: 2192, s: 1.15 }],
    [A.second + 1.6, { x: 960, y: 520, s: 1.0 }], [A.guards2 - .3, { x: 960, y: 515, s: 1.02 }],
    [A.guards2 + 1.5, { x: 960, y: -610, s: .93 }], [A.harari - .3, { x: 965, y: -615, s: .95 }],
    [A.harari + 1.5, { x: 1170, y: -615, s: .95 }], [A.third - .4, { x: 1175, y: -615, s: .96 }],
    [A.third + 1.6, { x: 1060, y: 520, s: 1.0 }], [A.guards3 - .2, { x: 1065, y: 520, s: 1.02 }],
    [A.guards3 + 1.8, { x: 2290, y: 540, s: 1.0 }], [A.britain - .3, { x: 2300, y: 542, s: 1.02 }],
    [A.britain + 1.8, { x: 3480, y: 540, s: .9 }], [A.examiner + 2.2, { x: 3490, y: 544, s: .92 }],
    [A.builds + 1.4, { x: 960, y: 520, s: .87 }], [A.youAsk + 1, { x: 960, y: 530, s: .89 }], [A.ends, { x: 960, y: 540, s: .92 }],
    [C3.start + .3, { x: 960, y: 540, s: 1 / 1.08 }]];
  const view = (t) => { const v = X.viewPath(t, VB); return { ...v, s: v.s * creepK(t) }; };

  // ------------------------------------------------------------------------------------------------ the anvil (home)
  const AN = S.ANVIL, MY = AN.top - 52, ML = 170;
  const fill = (t, i) => [span(t, A.human - .15, A.human + .75), span(t, A.says - .25, A.says + .6), span(t, A.third + .2, A.third + 1.0)][i];
  const cool = (t) => span(t, A.builds + .15, A.builds + 1.1);
  const sink = (t) => expoIn(span(t, A.builds + 1.5, A.lawmakers + .3));
  const GX = [560, 960, 1360], GY = 800;                        // the three groups (lawmakers, labs, you)
  const spread = (t) => sineIO(span(t, A.builds + 1.5, A.lawmakers + .4));
  const liftU = (t, i) => expoOut(span(t, [A.lawmakers, A.labs, A.youAsk][i] - .2, [A.lawmakers, A.labs, A.youAsk][i] + .7));
  const QT = [A.q1, A.q2, A.q3];
  const cardM = (t, i) => span(t, QT[i] - .15, QT[i] + .45) * (1 - span(t, A.ends - .1, A.ends + .5));
  const flipU = (t, i) => sineIO(span(t, A.people + .05 + i * .1, A.people + .65 + i * .1)) + sineIO(span(t, A.ends - .6 + i * .08, A.ends - .1 + i * .08));
  const LINKX = [849, 960, 1071], LINKY = 520;
  const joinU = (t) => sineIO(span(t, A.ends + .2, A.ends + 1.3));
  function ringPos(t, i) {
    const sp = spread(t), lu = liftU(t, i), j = joinU(t);
    let x = lerp(S.moldX(i), GX[i], sp), y = lerp(MY, 620, sp) - 30 * lu;
    x = lerp(x, LINKX[i], j); y = lerp(y, LINKY, j);
    return [x, y];
  }
  function anvilStage(ctx, t) {
    const sk = sink(t); if (sk >= 1 && spread(t) <= 0) return;
    ctx.save(); ctx.translate(0, sk * 620);
    if (sk < 1) S.anvil(ctx, t, AN.x, AN.top, AN.w);
    ctx.restore();
    for (let i = 0; i < 3; i++) {
      const f = fill(t, i), [x, y] = ringPos(t, i);
      if (f <= 0) { ctx.save(); ctx.translate(0, sk * 620); F.chainLink(ctx, t, S.moldX(i), MY, ML, 0, { mould: 1 }); halo(ctx, S.moldX(i), MY, 150, .18 + .06 * Math.sin(t * 2 + i), LAMP.body, LAMP.core); ctx.restore(); continue; }
      if (cardM(t, i) > 0 || joinU(t) > 0) continue;   // drawn by the card / link stage
      if (spread(t) <= 0) B.pourRing(ctx, t, x, y, ML, { fill: f, glow: (f >= 1 ? 1 : f) * (1 - cool(t)) });
      else F.chainLink(ctx, t, x, y, lerp(ML, 150, spread(t)), 0, { lit: .25 * liftU(t, i) });
    }
  }

  // ------------------------------------------------------------------------------------------------ test 1 stations
  function deadEnd(ctx, t) {
    const gu = span(t, A.guards1 + .1, A.guards1 + 1.3);
    X.lightLine(ctx, [[2290, 660], [1700, 660]], gu, { w: 2, a: .35, glow: false }); X.lightLine(ctx, [[2290, 660], [2900, 660]], gu, { w: 2, a: .35, glow: false });
    const du = span(t, A.guards1 + .7, A.guards1 + 1.5);
    if (du > 0) { ctx.save(); ctx.translate(0, (1 - expoOut(du)) * 30); X.doc(ctx, t, 1880, 560, 104, { kind: 'form', u: du }); ctx.restore(); }
    X.label(ctx, 'NO', 1880, 470, lab(t, A.guards1 + 1.2), { size: 40, spacing: .08 });
    const au = span(t, A.dead - .7, A.dead + .25);
    X.lightLine(ctx, [[1950, 560], [2585, 560]], au, { w: 3 });
    if (au >= 1) B.arrowHead(ctx, 2586, 560, 0, 14, CREAM, .9);
    const wu = expoOut(span(t, A.dead - .2, A.dead + .45));
    if (wu > 0) { ctx.fillStyle = mixHex(P.ind2, P.blue1, .45); ctx.fillRect(2600, 660 - 260 * wu, 18, 260 * wu); ctx.fillStyle = rgba(CREAM, .6); ctx.fillRect(2600, 660 - 260 * wu, 2, 260 * wu); }
    X.label(ctx, 'DEAD END', 2609, 700, lab(t, A.dead + .1), { size: 28, spacing: .14 });
    // the new ring runs in along the arrow, a person rises at its end
    const ru = sineIO(span(t, A.nobody + .15, A.nobody + 1.0));
    if (ru > 0) F.chainLink(ctx, t, lerp(1500, 2470, ru), 560, 80, 0, { lit: .7 });
    B.personRise(ctx, 2535, 660, 170, span(t, A.nobody + .6, A.nobody + 1.3), { dir: -1, light: 1, look: .1 * Math.sin(t * .7), rim: LAMP.body });
    if (ru >= 1) halo(ctx, 2470, 560, 90, .25 + .05 * Math.sin(t * 2), GOLD.halo, GOLD.core);
  }
  function court(ctx, t) {
    const gu = span(t, A.court + .3, A.court + 1.4);
    X.lightLine(ctx, [[2300, 1640], [1650, 1640]], gu, { w: 2, a: .35, glow: false }); X.lightLine(ctx, [[2300, 1640], [2950, 1640]], gu, { w: 2, a: .35, glow: false });
    const raise = sineIO(span(t, A.contest - .2, A.contest + .5)) * (1 - span(t, A.but + .4, A.but + 1.2));
    B.personRise(ctx, 1880, 1640, 230, span(t, Math.min(A.woman - .5, A.court + 1.2), Math.min(A.woman + .4, A.court + 2.2)), { dir: 1, long: true, light: .9, look: .15 + .1 * Math.sin(t * .6), armR: [lerp(1.25, 2.3, raise), lerp(1.6, 2.6, raise)], rim: LAMP.body });
    const fold = sineIO(span(t, A.but - .1, A.but + .5));
    const du = span(t, A.phone - .35, A.phone + .4);
    if (du > 0 && fold < 1) {
      ctx.save(); ctx.translate(2060, 1500 + (1 - expoOut(du)) * 30); ctx.scale(1, 1 - fold);
      X.doc(ctx, t, 0, 0, 126, { kind: 'contract', u: du, rot: -.04 });
      ctx.globalAlpha *= clamp(du * 3); ctx.strokeStyle = PAPER_INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(22, -66, 26, 42, 5); ctx.stroke(); ctx.fillStyle = PAPER_INK; ctx.fillRect(31, -30, 8, 3);
      ctx.restore();
    }
    X.label(ctx, 'PHONE CONTRACT', 2060, 1625, lab(t, A.phone + .1, A.but + .1), { size: 24, spacing: .12 });
    X.lightLine(ctx, [[2130, 1480], [2430, 1480]], span(t, A.auto - .5, A.auto + .1) * (1 - fold), { w: 2.5, col: rgba(COOL.line, .85), glowCol: COOL.halo });
    const open = span(t, A.whoever - .1, A.whoever + .8);
    const tip = B.dial(ctx, t, 2570, 1580, 140, { u: span(t, A.phone + .1, A.auto - .1), needle: expoOut(span(t, A.auto + .2, A.auto + .9)), open });
    X.label(ctx, 'AUTOMATIC SCORE', 2570, 1625, lab(t, A.auto - .1, A.whoever + .2), { size: 24, spacing: .12 });
    if (tip) X.label(ctx, 'REFUSED', tip[0] - 20, tip[1] - 34, lab(t, A.auto + .6, A.whoever + .1), { size: 30, spacing: .14, align: 'right' });
    // the explanation sheet unfolds up out of the dial's base line, then folds back down into a line (8.06)
    const su = span(t, A.whoever + .3, A.whoever + 1.3) * (1 - fold);
    B.sheet(ctx, t, 2570, 1580, 300, 330, su, { head: 'WHY: THE SCORE' });
  }
  const TLY = 2300, YX = (y) => 1850 + (y - 2025) * 300;
  function timeline(ctx, t) {
    // the folded sheet = a line that falls and runs out both ways into the timeline
    const fall = sineIO(span(t, A.but + .3, A.but + 1.7)), run = expoOut(span(t, A.but + 1.2, A.but + 2.3));
    if (fall <= 0) return;
    const y = lerp(1580, TLY, fall), x0 = lerp(2420, 1150, run), x1 = lerp(2720, 3000, run);
    ctx.save(); ctx.strokeStyle = rgba(CREAM, .8); ctx.lineWidth = 3; ctx.shadowColor = rgba(GOLD.halo, .5); ctx.shadowBlur = 8; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
    for (let k = 0; k < 4; k++) {
      const u = span(t, A.but + 1.6 + k * .08, A.but + 2.2 + k * .08); if (u <= 0) continue;
      ctx.fillStyle = rgba(CREAM, .7 * u); ctx.fillRect(YX(2025 + k) - 1.5, TLY - 14 * expoOut(u), 3, 28 * expoOut(u));
      X.label(ctx, String(2025 + k), YX(2025 + k), TLY + 52, u, { size: 24, spacing: .08, col: CREAM2c });
    }
    const mv = sineIO(span(t, A.postponed - .05, A.postponed + 1.2)), mu = span(t, A.oversight - .5, A.oversight + .3);
    const xa = YX(2026 + 7 / 12), xb = YX(2027 + 11 / 12), xm = lerp(xa, xb, mv);
    if (mv > 0) B.lineSpan(ctx, [[xa, TLY - 30], [xb, TLY - 30]], 0, mv, { w: 2, dash: [8, 8], a: .6, glow: false });
    if (mu > 0) {
      const k = expoOut(mu);
      ctx.fillStyle = rgba(CREAM, .9); ctx.fillRect(xm - 1.5, TLY - 90 * k, 3, 90 * k);
      ctx.fillStyle = mixHex(CREAM, GOLD.body, mv); ctx.beginPath(); ctx.arc(xm, TLY, 9 * k, 0, TAU); ctx.fill();
      X.label(ctx, 'HUMAN OVERSIGHT · HIRING, CREDIT', xm, TLY - 108, span(mu, .4, 1), { size: 24, spacing: .1 });
    }
    X.label(ctx, 'AUG 2026', xa, TLY + 100, lab(t, A.oversight - .1), { size: 26, spacing: .1 });
    X.label(ctx, 'DEC 2027', xb, TLY + 100, lab(t, A.postponed + .9), { size: 26, spacing: .1, gold: 1 });
  }
  function analyst(ctx, t) {
    // the timeline line runs on left into her floor; the 86 bar (6.09) small behind her; her lamp lights on 'their own'
    const lamp = span(t, A.judgment + .4, A.judgment + 1.2);
    const bu = expoOut(span(t, A.own + .3, A.own + 1.2)), bx = 1150, bh = 230;
    ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = 2; ctx.strokeRect(bx - 18, TLY - bh, 36, bh);
    if (bu > 0) { ctx.fillStyle = GOLD.body; ctx.fillRect(bx - 16, TLY - bh * .86 * bu, 32, bh * .86 * bu); }
    ctx.setLineDash([6, 6]); ctx.strokeStyle = rgba(CREAM, .5); ctx.beginPath(); ctx.moveTo(bx - 30, TLY - bh * .5); ctx.lineTo(bx + 30, TLY - bh * .5); ctx.stroke(); ctx.setLineDash([]);
    X.label(ctx, '86%', bx, TLY - bh - 22, lab(t, A.own + .8), { size: 26, gold: 1 });
    if (lamp > 0) halo(ctx, 1330, TLY - 300, 260, .45 * lamp, LAMP.body, LAMP.core);
    ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.fillRect(1395, TLY - 104, 4, -160); ctx.fillRect(1395, TLY - 264, 60, 4);
    if (lamp > 0) halo(ctx, 1450, TLY - 256, 50, .7 * lamp, LAMP.body, LAMP.core);
    E.person(ctx, 1330, TLY, 220, { dir: 1, light: .7 + .3 * lamp, look: -.1 + .06 * Math.sin(t * .8), armR: [1.35, 1.75 + .05 * Math.sin(t * 5)], armL: [1.1, 1.5], rim: LAMP.body });
    ctx.fillStyle = mixHex(P.night1, P.blue1, .35); ctx.fillRect(1380, TLY - 100, 200, 10); ctx.fillRect(1395, TLY - 90, 8, 90); ctx.fillRect(1555, TLY - 90, 8, 90);
    X.aiScreen(ctx, t, 1500, TLY - 104, 140);
  }

  // ------------------------------------------------------------------------------------------------ test 2 stations
  const SC = { x: 960, y: -520, w: 380 }, GR2 = -406;
  function screenStage(ctx, t) {
    X.lightLine(ctx, [[960, GR2], [500, GR2]], span(t, A.guards2, A.guards2 + 1.2), { w: 2, a: .35, glow: false });
    X.lightLine(ctx, [[960, GR2], [1700, GR2]], span(t, A.guards2, A.guards2 + 1.2), { w: 2, a: .35, glow: false });
    const sh = SC.w * .66, sx = SC.x - SC.w * .45, sy = SC.y - sh * .93, sw = SC.w * .9, shh = sh * .86, ex = SC.x, ey = SC.y - sh * .5;
    X.aiScreen(ctx, t, SC.x, SC.y, SC.w);
    // 8.11: the iris opens into a chat window (a circle mask grows from the iris), first line a tag: AI
    const cu = sineIO(span(t, A.chatbot - .2, A.chatbot + .8));
    if (cu > 0) {
      ctx.save(); ctx.beginPath(); ctx.roundRect(sx, sy, sw, shh, SC.w * .03); ctx.clip(); ctx.beginPath(); ctx.arc(ex, ey, 20 + cu * sw * .7, 0, TAU); ctx.clip();
      ctx.fillStyle = mixHex(P.night1, COOL.deep, .55); ctx.fillRect(sx, sy, sw, shh);
      const tu = span(t, A.chatbot + .3, A.chatbot + .9), lx = sx + 26;
      ctx.fillStyle = rgba(COOL.body, .25 * tu); ctx.strokeStyle = rgba(COOL.core, .9 * tu); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(lx, sy + 22, 70, 38, 19); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = tu; ctx.font = '700 24px Inter'; ctx.fillStyle = COOL.core; ctx.textBaseline = 'middle'; ctx.fillText('AI', lx + 20, sy + 42); ctx.globalAlpha = 1;
      for (let j = 0; j < 3; j++) { const bu = span(t, A.chatbot + .6 + j * .15, A.chatbot + 1.1 + j * .15); if (bu <= 0) continue; ctx.fillStyle = rgba(j === 1 ? CREAM : COOL.body, .55 * bu); ctx.beginPath(); ctx.roundRect(j === 1 ? sx + sw - 26 - 150 * expoOut(bu) : lx, sy + 82 + j * 40, 150 * expoOut(bu) + (j === 2 ? 50 : 0), 24, 12); ctx.fill(); }
      ctx.restore();
    }
    // the person shape in front of the screen; slides off on 'pretends' and waits beside it; 8.12 a gold bar bars it
    const pu = span(t, A.guards2 + .4, A.guards2 + 1.3), off = sineIO(span(t, A.pretends - .1, A.pretends + 1.1));
    const px = lerp(SC.x, 1420, off), ban = span(t, A.ban - .05, A.ban + .55);
    if (pu > 0) B.personRise(ctx, px, GR2, 380, pu, { dir: 1, light: lerp(.9, .35, ban), look: .05 * Math.sin(t * .7), rim: CREAM });
    if (ban > 0) { F.goldSpan(ctx, [[px - 120, GR2 - 230], [px + 120, GR2 - 230]], 0, expoOut(ban), { w: 4 }); }
  }

  // ------------------------------------------------------------------------------------------------ test 3 stations
  const GR3 = 760, BOXX = 2420, MODEL0 = [BOXX, GR3 - 220], BENCH = { x0: 3150, x1: 3900, y: 690 };
  const LAMPS = (() => { const out = [], c = 11, cell = 38, gap = 12, x0 = (BENCH.x0 + BENCH.x1) / 2 - (c * (cell + gap) - gap) / 2; for (let k = 0; k < 43; k++) out.push([x0 + (k % c) * (cell + gap) + cell / 2, 450 + Math.floor(k / c) * (cell + gap) + cell / 2]); return out; })();
  const LIT = [2, 9, 13, 17, 20, 26, 30, 35, 40];
  function examinerX(t) {
    const a = sineIO(span(t, A.indep - .5, A.indep + .9)), b = sineIO(span(t, A.guards3 + .1, A.guards3 + 1.8)), c = sineIO(span(t, A.britain + .1, A.britain + 1.9));
    return lerp(lerp(lerp(1900, 1530, a), 2150, b), 2960, c);
  }
  const examinerWalked = (t) => 370 * sineIO(span(t, A.indep - .5, A.indep + .9)) + 620 * sineIO(span(t, A.guards3 + .1, A.guards3 + 1.8)) + 810 * sineIO(span(t, A.britain + .1, A.britain + 1.9));
  function examinerStage(ctx, t) {
    // the walk phase follows the distance walked (one stride ≈ 2π per 150 px), so stopping is continuous: he stands in the pose he stopped in
    const x = examinerX(t), walked = examinerWalked(t);
    const dir = t < A.guards3 ? -1 : 1, reach = sineIO(span(t, A.makerW - .4, A.makerW + .3)) * (1 - span(t, A.makerW + 1.2, A.makerW + 1.8));
    const hands = E.person(ctx, x, GR3, 220, { dir, light: .9, look: .1 * Math.sin(t * .6), walk: walked / 150 * TAU, armR: [lerp(1.6, 2.4, reach), lerp(2.0, 2.6, reach)], armL: [-.15, -.1], rim: LAMP.body });
    if (hands?.R) B.magnifier(ctx, t, hands.R[0] - dir * 26, hands.R[1] - 30, 30, dir < 0 ? .9 : Math.PI - .9, { lit: span(t, A.indep, A.indep + .6) });
    X.label(ctx, 'EXAMINER', x, GR3 + 40, lab(t, A.examiner, A.builds + .2), { size: 24, spacing: .14, gold: .5 });
    return hands;
  }
  function boxStage(ctx, t) {
    const open = span(t, A.makerW - .1, A.makerW + .9);
    B.sealedBox(ctx, t, BOXX, GR3, 240, 190, { open });
    X.label(ctx, SRC.boe81, BOXX, GR3 + 44, lab(t, A.guards3 + .9, A.britain + 1.4), { size: 24, spacing: .08 });
  }
  function modelPos(t) {
    const r = expoOut(span(t, A.makerW + .5, A.makerW + 1.5)), m = sineIO(span(t, A.britain, A.britain + 1.8));
    return [lerp(BOXX, 3040, m), lerp(lerp(GR3 - 150, GR3 - 250, r), BENCH.y - 120, m), r];
  }
  function model(ctx, t) {
    const [x, y, r] = modelPos(t); if (r <= 0) return;
    ctx.save(); if (t < A.britain) { ctx.beginPath(); ctx.rect(x - 200, -4000, 400, GR3 - 190 + 4000); ctx.clip(); }
    halo(ctx, x, y, 120, .35, COOL.halo, COOL.core);
    ctx.fillStyle = mixHex(COOL.deep, COOL.body, .3); ctx.beginPath(); ctx.arc(x, y, 46, 0, TAU); ctx.fill();
    for (let k = 0; k < 3; k++) { ctx.strokeStyle = rgba(COOL.core, .35 + .2 * k); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 38 * (1 - k * .28) * (1 + .04 * Math.sin(t * 1.6 - k)), 0, TAU); ctx.stroke(); }
    ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function bench(ctx, t) {
    const gu = span(t, A.britain + .8, A.britain + 1.8);
    if (gu > 0) { ctx.fillStyle = mixHex(P.night1, P.blue1, .4); const xe = lerp(BENCH.x0, BENCH.x1, expoOut(gu)); ctx.fillRect(BENCH.x0, BENCH.y, xe - BENCH.x0, 12); ctx.fillRect(BENCH.x0 + 20, BENCH.y + 12, 10, (GR3 - BENCH.y - 12) * gu); ctx.fillRect(xe - 30, BENCH.y + 12, 10, (GR3 - BENCH.y - 12) * gu); ctx.fillStyle = rgba(CREAM, .5); ctx.fillRect(BENCH.x0, BENCH.y, xe - BENCH.x0, 2); }
    const [mx, my] = modelPos(t);
    LAMPS.forEach(([x, y], k) => {
      const u = span(t, A.tests - .1 + k * .022, A.tests + .4 + k * .022); if (u <= 0) return;
      const li = LIT.indexOf(k), lit = li >= 0 ? span(t, A.caught - .05 + li * .045, A.caught + .2 + li * .045) : 0, s = expoOut(u);
      ctx.fillStyle = mixHex(mixHex(P.night1, P.ind2, .6), COOL.core, lit); ctx.strokeStyle = rgba(CREAM, .35 + .4 * lit); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(x - 19 * s, y - 19 * s, 38 * s, 38 * s, 7); ctx.fill(); ctx.stroke();
      if (lit > 0) halo(ctx, x, y, 46 + 40 * Math.sin(Math.PI * clamp(lit * 1.5)) * (lit < 1 ? 1 : 0), .5 * lit, COOL.halo, COOL.core);
    });
    const lu = span(t, A.tests - .3, A.tests + .5);
    if (lu > 0) X.lightLine(ctx, [[mx + 50, my], [LAMPS[0][0] - 40, my], [LAMPS[0][0] - 40, LAMPS[0][1]], [LAMPS[0][0] - 22, LAMPS[0][1]]], lu, { w: 2, col: rgba(COOL.line, .7), glowCol: COOL.halo });
    // 8.17: each lit lamp runs up into a closed gate
    const gy = 405, gte = span(t, A.none - .15, A.none + .55);
    LIT.forEach((k, j) => { const [x, y] = LAMPS[k], u = span(t, A.none + .1 + j * .04, A.none + .6 + j * .04); if (u > 0) B.lineSpan(ctx, [[x, y - 20], [x, gy + 6]], 0, expoOut(u), { w: 2, col: rgba(COOL.line, .8), glowCol: COOL.halo }); });
    if (gte > 0) { F.goldSpan(ctx, [[LAMPS[0][0] - 30, gy], [LAMPS[10][0] + 30, gy]], 0, expoOut(gte), { w: 4, spark: false }); for (const x of [LAMPS[0][0] - 30, LAMPS[10][0] + 30]) { ctx.fillStyle = rgba(GOLD.body, gte); ctx.fillRect(x - 3, gy - 22, 6, 44); } }
    X.label(ctx, SRC.aisi, (BENCH.x0 + BENCH.x1) / 2, GR3 + 44, lab(t, A.britain + 1.4, A.builds - .1), { size: 26, spacing: .12 });
    // 8.18: the maker at the far end; the examiner's gold arrow reaches the lamps, the maker's dashed one stops short
    const mk = span(t, A.examiner - .4, A.examiner + .4);
    B.personRise(ctx, 4080, GR3, 200, mk, { dir: -1, light: .45, look: .05 * Math.sin(t * .5) });
    X.label(ctx, 'MAKER', 4080, GR3 + 40, lab(t, A.examiner + .2, A.builds + .2), { size: 24, spacing: .14 });
    const ex = examinerX(t), ga = span(t, A.examiner + .3, A.examiner + 1.1);
    if (ga > 0) { const pts = []; for (let i = 0; i <= 24; i++) { const f = i / 24; pts.push([lerp(ex + 40, LAMPS[0][0] - 50, f), lerp(GR3 - 250, LAMPS[11][1], f) - Math.sin(Math.PI * f) * 120]); } const e = F.goldSpan(ctx, pts, 0, expoOut(ga), { w: 3 }); if (ga >= 1 && e) B.arrowHead(ctx, pts[24][0], pts[24][1], Math.atan2(pts[24][1] - pts[23][1], pts[24][0] - pts[23][0]), 14, GOLD.body); }
    const ma = span(t, A.notMaker - .1, A.notMaker + .6);
    if (ma > 0) { const pts = []; for (let i = 0; i <= 24; i++) { const f = i / 24; pts.push([lerp(4040, LAMPS[10][0] + 50, f), lerp(GR3 - 230, LAMPS[21][1], f) - Math.sin(Math.PI * f) * 100]); } B.lineSpan(ctx, pts, 0, .42 * expoOut(ma), { w: 2.5, dash: [8, 9], a: .55, glow: false }); }
  }

  // ------------------------------------------------------------------------------------------------ the forgers and the questions
  function groups(ctx, t) {
    const gl = span(t, A.builds + 1.8, A.lawmakers + .6);
    if (gl > 0) { X.lightLine(ctx, [[960, GY], [200, GY]], gl, { w: 2, a: .35, glow: false }); X.lightLine(ctx, [[960, GY], [1720, GY]], gl, { w: 2, a: .35, glow: false }); }
    const lift = { armR: [2.85, 3.02], armL: [-2.85, -3.02] };
    const TT = [A.lawmakers, A.labs, A.youAsk];
    for (let i = 0; i < 3; i++) {
      const u = span(t, TT[i] - .25, TT[i] + .55); if (u <= 0) continue;
      if (i < 2) for (const [dx, hh, d] of [[-78, 140, 1], [0, 150, -1], [78, 136, 1]]) {
        B.personRise(ctx, GX[i] + dx, GY, hh, clamp(u * 1.3 - (dx + 78) / 600), { ...lift, dir: d, long: i === 1, light: .8, look: .3 + .05 * Math.sin(t * .7 + dx), rim: i === 1 ? CREAM : undefined });
      } else B.personRise(ctx, GX[2], GY, 150, u, { ...lift, dir: 1, look: .5 + .05 * Math.sin(t * .7), light: 1 }, true);
      X.label(ctx, ['LAWMAKERS', 'LABS', 'YOU'][i], GX[i], GY + 36, lab(t, TT[i] + .1, A.q1 + .1), { size: 26, spacing: .16, gold: i === 2 ? .6 : 0 });
    }
  }
  function machineDisc(ctx, t) {
    const u = expoOut(span(t, A.notOne - .3, A.notOne + 1.1)); if (u <= 0) return;
    const y = lerp(600, 300, u), r = 160;
    ctx.save(); ctx.beginPath(); ctx.rect(0, -2000, 3000, 2000 + 610); ctx.clip();
    halo(ctx, 960, y, r * 2, .3 * u, COOL.halo, COOL.core);
    ctx.fillStyle = E.rad(ctx, 960 - r * .3, y - r * .35, r * 1.2, [[0, mixHex(P.ind1, COOL.deep, .7)], [1, mixHex(P.night0, P.ind0, .5)]]); ctx.beginPath(); ctx.arc(960, y, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(COOL.line, .6); ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = rgba(COOL.line, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(960 - r * .92, y + 4); ctx.quadraticCurveTo(960, y + 18, 960 + r * .92, y + 4); ctx.stroke();   // the closed lid
    ctx.restore();
  }
  function cards(ctx, t) {
    for (let i = 0; i < 3; i++) {
      const m = cardM(t, i), j = joinU(t); if (m <= 0 && j <= 0) continue;
      const [x, y] = ringPos(t, i);
      if (j > 0 && m <= 0) { F.chainLink(ctx, t, x, y, 150, i === 1 ? Math.PI / 2 * j : 0, { lit: .25 }); continue; }
      B.ringCard(ctx, t, x, lerp(y, 560, sineIO(m)), 150, 360, 120, m, { text: ['WHO ANSWERS FOR THIS?', 'IS THIS A MACHINE?', 'WHO CHECKED IT?'][i], size: 30, flip: flipU(t, i), rot: (i - 1) * .015 });
    }
  }
  const plateFrom = (v) => { const [x0, y0] = X.toScreen(v, LINKX[0] - 75, LINKY - 44), [x1, y1] = X.toScreen(v, LINKX[2] + 75, LINKY + 44); return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; };

  // ------------------------------------------------------------------------------------------------ the HUD: the plate's four small links fly up into it
  const HM = [T0 + S.SEAM_HALF, T0 + 2.0];
  function hud(ctx, t, v) {
    const k = sineIO(span(t, HM[0], HM[1]));
    if (k >= 1) { F.chainHud(ctx, t, T); return; }
    const pl = { face: [0, 1, 2, 3].map((i) => { const [x, y] = X.toScreen(v, W / 2 + (i - 1.5) * 120, 250); return { x, y, L: 90 * v.s, ang: 0 }; }),
      edge: [0, 1, 2].map((i) => { const [x, y] = X.toScreen(v, W / 2 + (i - 1) * 120, 250); return { x, y, L: 50 * v.s, ang: 0 }; }) };
    B.drawLayout(ctx, t, T, B.mixLayout(pl, B.hudLayout(t), k));
  }

  // ------------------------------------------------------------------------------------------------ the take
  function take(ctx, t) {
    if (t < T0 + S.SEAM_HALF) { S.plateAnvil(ctx, t, T); return; }
    if (t >= SWITCH) { c10(ctx, t); return; }
    const v = view(t), pk = span(t, T0 + .5, T0 + 2.5);
    X.board(ctx, t, v, { lx: lerp(AN.x, v.x, pk), ly: lerp(AN.top - 80, v.y - 20, pk) });
    const vis = (x0, x1, y0, y1) => { const [a, b] = X.toScreen(v, x0, y0), [c, d] = X.toScreen(v, x1, y1); return c > -200 && a < W + 200 && d > -200 && b < H + 200; };
    X.inView(ctx, v, () => {
      if (vis(150, 1800, 150, 1100)) { anvilStage(ctx, t); if (t > A.builds) { groups(ctx, t); machineDisc(ctx, t); cards(ctx, t); } }
      if (t > A.guards1 && t < A.second + 1 && vis(1600, 3000, 380, 760)) deadEnd(ctx, t);
      if (t > A.court && t < A.second + 1 && vis(1600, 3000, 1200, 1700)) court(ctx, t);
      if (t > A.but && t < A.second + 2 && vis(1000, 3100, 1900, 2450)) { timeline(ctx, t); analyst(ctx, t); }
      if (t > A.says && t < A.third + 2) {   // the bubble out of mould 2, carried up into the screen
        const bu = span(t, A.says + .3, A.says + 1.0), up = sineIO(span(t, A.guards2 - .3, A.guards2 + 1.3)), into = span(t, A.guards2 + .9, A.guards2 + 1.5);
        if (bu > 0 && into < 1) { ctx.save(); const bx = lerp(990, SC.x, up), by = lerp(430, SC.y - 170, up), s = 1 - sineIO(into); ctx.translate(bx, by); ctx.scale(s, s); ctx.translate(-bx, -by); B.bubble(ctx, t, bx, by, 330, 70, 'I AM A MACHINE', bu); ctx.restore(); }
        if (vis(400, 1800, -950, -300)) screenStage(ctx, t);
      }
      if (t > A.third - 1 && t < A.builds + 3) { if (vis(2100, 2800, 400, 820)) boxStage(ctx, t); if (t > A.britain - 1 && vis(2800, 4300, 350, 820)) bench(ctx, t); model(ctx, t); if (t > A.indep - 1) examinerStage(ctx, t); }
    });
    // statements (screen space), the HUD, sources
    const BIG = (txt, a, b, o = {}) => { const u = lab(t, a, b); if (u > 0) X.big(ctx, txt, W / 2, o.y ?? 190, o.size ?? 60, u, { gold: o.gold ?? .35 }); };
    BIG('A HUMAN ANSWERS FOR IT', A.human - .1, A.guards1 + .9);
    BIG('NOBODY IS RESPONSIBLE', A.nobody - .1, A.court + .2);
    BIG("EUROPE'S HIGHEST COURT", A.court + .3, A.whoever - .1);
    BIG('MUST EXPLAIN', A.explain - .1, A.but - .1);
    BIG('SO YOU CAN CONTEST', A.contest - .15, A.but - .1, { y: 262, size: 44, gold: .1 });
    BIG('POSTPONED TO DEC 2027', A.postponed + .1, A.own - .1);
    BIG('ONLY IF THE JUDGMENT IS THEIRS', A.own + .5, A.second - .1, { size: 56 });
    BIG('IT SAYS WHAT IT IS', A.says + .3, A.guards2 + .4);
    BIG('PRETENDS TO BE A PERSON', A.pretends - .1, A.since - .1);
    BIG('REQUIRED BY LAW', A.since + .1, A.harari - .1);
    X.dateTag(ctx, SRC.art50, W / 2, 262, lab(t, A.since + .3, A.harari - .1));
    BIG('HARARI: BAN THE PRETENDERS', A.harari + .2, A.third - .1);
    BIG('SOMEONE OUTSIDE CAN CHECK', A.indep - .1, A.guards3 + 1.2);
    BIG("NOT THE MAKER'S WORD", A.makerW - .1, A.britain - .1);
    BIG('TESTS MODELS ITSELF', A.tests - .1, A.thisYear + 1.1);
    BIG(SRC.aisiRuns, A.caught - .1, A.none - .1, { gold: .9 });
    BIG('NO ATTEMPT SUCCEEDED', A.none + .1, A.examiner - .1);
    BIG('THE EXAMINER FOUND IT', A.examiner + .3, A.builds - .1);
    BIG('NONE BUILDS ITSELF', A.builds + .1, A.lawmakers + 1.2);
    BIG('NONE REQUIRES UNDERSTANDING THE MACHINE', A.notOne + .2, A.people - .1, { y: 110, size: 50 });
    BIG('ALL ABOUT PEOPLE', A.people + .3, A.ends - .1, { y: 110 });
    F.source(ctx, t, A.court + .4, A.but - .2, SRC.cjeu);
    F.source(ctx, t, A.but + .5, A.second - .3, SRC.aiAct);
    F.source(ctx, t, A.guards3 + 1.0, A.britain - .2, SRC.boe81Src);
    F.source(ctx, t, A.thisYear + .3, A.builds - .3, SRC.aisiSrc);
    hud(ctx, t, v);
    // 8.28: the linked rings grow into the clip frame
    if (t > A.ends + 1.2) F.clipPlate(ctx, t, T, 'C3', { from: plateFrom(v), morph: span(t, A.ends + 1.3, C3.start + .2), dark: (1 - span(t, C3.start - .2, C3.start + .2)) * .35 });
  }
  return [{ t: R.a, draw: take, print: PR }];
};
const PAPER_INK = F.PAPER.ink;
const CREAM2c = F.CREAM2;
