// Film 78 · B1 · c06 'But on that same stage' → 'That is why this channel exists' (253.1–348.85 s). Rows 5.01–5.27 (docs/shots.md):
//   5.01–5.05 a lens out of marker 3 back onto the NeurIPS stage: the recipe's DATA gauge drains; text pours from one pile; the pile is ONE
//        globe: "we have but one internet." (NEURIPS · VANCOUVER · DEC 2024); "will unquestionably end": the gauge empties, the old
//        recipe's line stops at a wall · 5.06 back into marker 3: OPEN
//   5.07 THE RECIPE and GOOGLE cards (Google's gauge a little higher): MAY BE GETTING MORE OUT OF IT · 5.08 a machine ring with a gap
//   5.09 ★ YOU: 3 examples → a gold tick · THE MACHINE: a wall of thousands · 5.10 marker 4 lights
//   5.11–5.14 a lens out of marker 4: "a superintelligent fifteen-year-old" (cool light, school bag); its knowledge bar almost empty; doors
//        with job signs, it walks to the first; the LINE: ALL JOBS · NO YEAR GIVEN · 5.15 back into marker 4: the ? YEARS box glows
//   5.16 HOW LONG UNTIL A MACHINE LEARNS AS WELL AS A PERSON? · PODCAST · NOV 2025 · 5.17 C3 out of the number box, caption
//        A MACHINE THAT LEARNS LIKE A HUMAN: 5 TO 20 YEARS · 5.18 ★ the box: 5–20 YEARS
//   5.19–5.23 the life line runs on as a time axis: the span 2030 → 2045, FORECAST · NOT FACT, the far end frays into fog, grey markers of
//        other forecasts land further right, 2045 lights · 5.24 you walk the span: AGE 45 → AGE 65 · YOUR WORKING LIFE
//   5.25 a child walks beside you: STARTS WORK · 5.26 the end warms like dawn · 5.27 the axis folds back, ONE knot: 1 CONDITION →
//        exactly S.recordPicture at T1 − .5 (where S.plateRecord takes over)
import * as E from './f10_editorial.mjs';
import * as F from './f78_kit.mjs';
import * as S from './f78_world.mjs';
import * as B from './b1_kit.mjs';
import c05f, { M3, M4, photo, audience, youChat } from './b1_c05.mjs';
import { GY4, LINE } from './b1_c04.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL, INK, mv, rise, measure } = F;
const TAU = Math.PI * 2;
const lerpR = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });

const R0 = S.RECORD, LY = R0.y, PXY = 100, X25 = M4.cx;       // the future axis: 2025 at marker 4, 100 px per year
const XY = (yr) => X25 + (yr - 2025) * PXY;
const SCR = { x: 600, y: 130, w: 720, h: 372 }, RC1 = { x: 630, y: 132, w: 660 }, RC2 = { x: 640, y: 250, w: 760 };
const PILE = { x: 330, y: 780 }, GLOBE = { x: 330, y: 520, r: 175 }, WALL = { x: 1660, y: 300, w: 46, h: 360 };
const BOXR = { x: X25 - 82, y: LY - 26 - 110, w: 164, h: 60 };
const DOORS = [['PROGRAMMER', 1120], ['DOCTOR', 1370], ['ACCOUNTANT', 1620], ['DESIGNER', 1870]];

function pile(ctx, t, u, n) {   // a mound of text lines (n rows left of 12), u = alpha
  if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= u;
  const r = prng(66);
  for (let i = 0; i < 12; i++) {
    if (i >= n) break;
    const w = 300 - i * 22, y = PILE.y - i * 16;
    for (let x = PILE.x - w / 2; x < PILE.x + w / 2 - 10;) { const l = 18 + r() * 40; ctx.fillStyle = rgba(GOLD.body, .55 + .25 * r()); ctx.fillRect(x, y, Math.min(l, PILE.x + w / 2 - x), 7); x += l + 8; }
  }
  ctx.restore();
}
function globe(ctx, t, u, a = 1) {   // ONE globe made of text lines, turning
  u = clamp(u); if (u <= 0 || a <= 0) return;
  const k = expoOut(u), r = GLOBE.r * (.5 + .5 * k);
  ctx.save(); ctx.globalAlpha *= a * clamp(u * 2);
  halo(ctx, GLOBE.x, GLOBE.y, r * 1.7, .3, GOLD.halo, GOLD.hot);
  ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.beginPath(); ctx.arc(GLOBE.x, GLOBE.y, r, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(GLOBE.x, GLOBE.y, r - 3, 0, TAU); ctx.clip();
  const rnd = prng(71);
  for (let i = 0; i < 13; i++) {
    const v = -1 + (i + .5) * 2 / 13, y = GLOBE.y + v * r, half = Math.sqrt(1 - v * v) * r, sp = (t * 22 * (1 - Math.abs(v) * .4) + rnd() * 200) % 80;
    for (let x = GLOBE.x - half - 80 + sp; x < GLOBE.x + half;) { const l = 14 + rnd() * 34; const f = Math.abs(x - GLOBE.x) / Math.max(1, half); ctx.fillStyle = rgba(GOLD.body, .75 * (1 - f * f * .7)); ctx.fillRect(x, y - 3, l * (1 - f * .4), 6); x += l + 9; }
  }
  ctx.restore();
  ctx.strokeStyle = rgba(GOLD.line, .85); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(GLOBE.x, GLOBE.y, r, 0, TAU); ctx.stroke();
  ctx.restore();
}
function door(ctx, t, x, name, u, lit) {   // a door with a job sign (rises out of the ground)
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), w = 140, h = 250, y = GY4 - h + (1 - k) * (h + 60);
  ctx.save(); ctx.beginPath(); ctx.rect(x - 200, -800, 400, GY4 + 800); ctx.clip();
  halo(ctx, x, y + h * .5, 190, .16 + .2 * lit, GOLD.halo, GOLD.hot);
  ctx.fillStyle = mixHex(mixHex(P.ind1, P.blue1, .35), GOLD.mid, .45 * lit); ctx.fillRect(x - w / 2, y, w, h);
  ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 3; ctx.strokeRect(x - w / 2 - 6, y - 6, w + 12, h + 6);
  ctx.fillStyle = rgba(CREAM, .7); ctx.beginPath(); ctx.arc(x + w / 2 - 22, y + h * .55, 5, 0, TAU); ctx.fill();
  ctx.restore();
  B.caps(ctx, name, x, y - 26, 22, span(u, .4, 1), { align: 'center', col: CREAM });
}

const C3CUTS = [74, 104, 132];   // first frames of the new shots inside the pre-cut C3 (the podcast's camera switches)
B.preloadCuts('C3', C3CUTS);

export default function c06(ctxB) {
  const { T, G } = ctxB, P5 = c05f(ctxB);
  const t0 = G('But on that same stage'), tThird = G('third prediction', 0, t0);
  const tRun = G('And it says his own recipe will run out'), tRunOut = G('run out', 0, tRun);
  const tNeeds = G('The recipe needs text'), tOnly = G('only so much', 0, tNeeds);
  const tWords = G('In his words'), tWe = G('we have but one internet', 0, tWords);
  const tSo = G('So this way of teaching machines'), tWill = G('will unquestionably end', 0, tSo), tEndW = G('end', 0, tWill + .5);
  const tStill = G('That one is still open');
  const tGoogle = G('Google, he admits'), tMore = G('getting more', 0, tGoogle);
  const tMissing = G('But something important'), tMiss = G('missing', 0, tMissing);
  const tToday = G("Today's machines"), tYouDo = G('the way you do', 0, tToday), tFew = G('few examples', 0, tToday);
  const tFourth = G('His fourth prediction'), tCan = G('machine that can', 0, tFourth);
  const tPict = G('He pictures it as'), tSuper = G('a superintelligent fifteen', 0, tPict);
  const tKnows = G('It knows very little'), tEager = G('But it is eager'), tJob = G('any job', 0, tEager);
  const tDayAI = G('For the day'), tNoYear = G('named no year', 0, tDayAI);
  const tHas = G('For this machine, he has'), tPod = G('A podcaster asked him'), tHowLong = G('how long until', 0, tPod);
  const clip = T.clip('C3') || { start: 311.31, end: 315.91 }, cs = clip.start, ce = clip.end;
  const tFive = G('Five to twenty years'), tUntil = G('Until a machine learns as well as you do');
  const tFore = G('That is a forecast'), tNotFact = G('not a fact', 0, tFore);
  const tHard = G('He himself calls the future'), tDoubt = G('And some researchers doubt');
  const tLong = G('But take his longest case'), tTwenty = G('twenty years', 0, tLong);
  const tAge = G('If you are forty-five today'), tLife = G('working life', 0, tAge);
  const tChild = G('And if you have a child'), tStarts = G('start work', 0, tChild);
  const tWell = G('And Ilya says he can see it going well'), tCond = G('On one condition');
  const T1 = G('That is why this channel exists'), tPlate = T1 - S.SEAM_HALF;

  const LV = { x: 870, y: 590, s: 1.28 };
  const keys = [
    [t0 + 1.5, { x: 960, y: 520, s: 1.0 }], [tThird + .6, { x: 960, y: 480, s: 1.04 }], [tRun + 1.4, { x: 960, y: 520, s: 1.0 }],
    [tOnly + .5, { x: 900, y: 540, s: 1.02 }], [tWe + .5, { x: 880, y: 520, s: 1.05 }], [tWill + .4, { x: 1080, y: 500, s: 1.03 }],
    [tEndW + .4, { x: 1160, y: 500, s: 1.07 }], [tStill + .8, LV], [tGoogle + 1.1, { x: 920, y: 500, s: 1.18 }],
    [tMissing + 1.0, { x: 960, y: 450, s: 1.05 }], [tToday + 1.2, { x: 990, y: 540, s: 1.0 }], [tFew + .6, { x: 960, y: 520, s: 1.03 }],
    [tFourth + 1.3, { x: 1000, y: 590, s: 1.28 }], [tCan + .6, { x: 1080, y: 590, s: 1.34 }], [tPict + 1.4, { x: 960, y: 540, s: 1.0 }],
    [tSuper + .8, { x: 900, y: 540, s: 1.05 }], [tEager + 1.0, { x: 1080, y: 540, s: 1.0 }], [tNoYear + .4, { x: 1100, y: 540, s: 1.03 }],
    [tHas + .9, { x: 1000, y: 560, s: 1.26 }], [tPod + 1.2, { x: 900, y: 500, s: 1.18 }], [cs - 1.2, { x: 990, y: 520, s: 1.22 }],
    [ce + .9, { x: 1100, y: 520, s: 1.28 }], [tFive + .6, { x: 1140, y: 530, s: 1.32 }], [tUntil + 1.6, { x: 2450, y: 560, s: .72 }],
    [tNotFact + .4, { x: 2550, y: 560, s: .75 }], [tDoubt + 1.6, { x: 2680, y: 560, s: .72 }], [tTwenty + .4, { x: 2950, y: 560, s: .8 }],
    [tAge + .6, { x: 2400, y: 540, s: .74 }], [tLife + .6, { x: 2600, y: 540, s: .74 }], [tStarts + .5, { x: 2350, y: 540, s: .74 }],
    [tWell + 1.2, { x: 2550, y: 560, s: .72 }],
  ];
  const dawn = (t) => .35 * mv(t, tWell - .2, 2.4);

  // ---------------------------------------------------------------------- the life line (from c05's state), the future axis folding back
  const fold = (t) => mv(t, tCond - .6, tPlate - tCond + .55);                  // 0 → 1: the axis folds back into the record picture
  function line6(ctx, t, o = {}) {
    const st = P5.lifeState(t), a = o.a ?? 1; if (a <= 0) return;
    const m4 = st.markers[3], five = span(t, tFive - .08, tFive + .35);
    if (five > 0) { m4.box = '5–20 YEARS'; m4.boxU = five; }
    const fl = fold(t);
    ctx.save(); ctx.globalAlpha *= a;
    F.lifeLine(ctx, t, R0.x0, R0.x1, LY, { u: st.u, years: R0.years, markers: st.markers, knot: span(t, tCond - .1, tCond + 1.2), knotF: .95, dawn: fl });
    ctx.restore();
    return st;
  }
  // flares on markers
  const pulse = (t, at, w = .45) => Math.exp(-(((t - at) / w) ** 2));

  // ---------------------------------------------------------------------- lens 3: the stage again; the recipe runs out
  const qWe = B.words(T.GW('we have but one internet', 'internet', tWords)); qWe[0].w = '“' + qWe[0].w; qWe[qWe.length - 1].w = qWe[qWe.length - 1].w.replace(/[.”"]+$/, '') + '.”';
  const qEnd = B.words(T.GW('will unquestionably end', 'end', tSo)); qEnd[0].w = '“' + qEnd[0].w; qEnd[qEnd.length - 1].w = qEnd[qEnd.length - 1].w.replace(/[.”"]+$/, '') + '”';
  function third(ctx, t) {
    const lift = mv(t, tRun - .3, 1.5), move = mv(t, tWords - .3, 1.4);
    // the stage (from c05), the recipe on its screen
    if (lift < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - lift; ctx.translate(0, expoIn(lift) * 400);
      ctx.fillStyle = lin(ctx, 0, 760, 0, 1080, [[0, mixHex(P.night1, P.ind1, .5)], [1, P.night0]]); ctx.fillRect(-400, 760, W + 800, 600);
      F.goldSpan(ctx, [[-400, 760], [W + 400, 760]], 0, 1, { w: 1.2, spark: false, a: .5 });
      F.lectern(ctx, t, 1420, 760, 210, { spot: .8, rings: span(t, t0 + 1, tThird) * .6, rise: 1 });
      audience(ctx, t, 1);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .45); ctx.fillRect(SCR.x - 10, SCR.y - 10, SCR.w + 20, SCR.h + 20);
      halo(ctx, SCR.x + SCR.w / 2, SCR.y + SCR.h / 2, SCR.w * .8, .2, COOL.halo, COOL.core);
      F.dateTag(ctx, 150, 150, F.SOURCES.neurips, span(t, t0 + 1.2, t0 + 1.9) * (1 - span(t, tRun - .4, tRun)));
      ctx.restore();
    }
    // the recipe card: lifted off the screen; its DATA gauge drains, refills a little from the pile, then runs empty
    const pour = span(t, tNeeds + .2, tWe - .2);
    const data = Math.max(0, 1 - .45 * sineIO(span(t, tRun + .3, tRunOut + .6)) + .2 * sineIO(pour) - .75 * sineIO(span(t, tWill - .3, tEndW + .1)));
    const R = lerpR(lerpR(RC1, { ...RC1, h: 0 }, 0), RC2, lift), Rm = { x: lerp(R.x, 900, move), y: lerp(R.y, 230, move), w: lerp(R.w, 640, move) };
    const out = mv(t, tStill - .6, .8);
    ctx.save(); ctx.globalAlpha *= 1 - out;
    const rc = F.recipeCard(ctx, t, Rm.x, Rm.y, Rm.w, { u: 1, net: 1, data });
    const gx = Rm.x + Rm.w * .62 + Rm.w * .15, gy = Rm.y + Rm.w * .56 * .55;   // the gauge's middle
    if (span(t, tRun + .3, tRunOut + .6) > 0 && span(t, tRun + .3, tRunOut + .6) < 1) B.caps(ctx, 'RUNNING OUT', gx, Rm.y + Rm.w * .56 + 46, 26, 1, { align: 'center', col: CREAM2 });
    // the pile of text pours into the gauge; it becomes ONE globe
    const pIn = span(t, tNeeds - .3, tNeeds + .5), toGlobe = mv(t, tWords - .2, 1.2), n = Math.round(12 - 7 * pour);
    pile(ctx, t, pIn * (1 - toGlobe), n);
    if (pour > 0 && pour < 1) for (let i = 0; i < 9; i++) {   // lines in flight from the pile to the gauge
      const f = (t * 1.3 + i / 9) % 1, sx = PILE.x + ((i * 37) % 11 - 5) * 14, sy = PILE.y - n * 16, cx = (sx + gx) / 2, cy = Math.min(sy, gy) - 220;
      const q = 1 - f, x = q * q * sx + 2 * q * f * cx + f * f * gx, y = q * q * sy + 2 * q * f * cy + f * f * gy;
      ctx.fillStyle = rgba(GOLD.hot, .9 * Math.sin(f * Math.PI)); ctx.fillRect(x - 16, y - 3, 32, 6);
    }
    globe(ctx, t, toGlobe, 1 - span(t, tWill + .4, tEndW + .6) * .5);
    B.spokenQuote(ctx, t, qWe, 960, 150, 60, span(t, tWe - .5, tWe + .2) * (1 - span(t, tSo, tSo + .4)), { align: 'center', maxW: 1600 });
    F.dateTag(ctx, 960, 200, F.SOURCES.neurips, span(t, tWe + .3, tWe + 1.0) * (1 - span(t, tSo, tSo + .4)), { align: 'center' });
    B.spokenQuote(ctx, t, qEnd, 960, 150, 64, span(t, tWill - .5, tWill + .2), { align: 'center', maxW: 1600 });
    // the old recipe's line runs out of the card and stops at a wall
    const ln = span(t, tWill - .2, tEndW + .05), wl = span(t, tWill - .4, tWill + .4);
    if (wl > 0) { const k = expoOut(wl); ctx.fillStyle = mixHex(P.night1, P.ind1, .55); ctx.fillRect(WALL.x, WALL.y + (1 - k) * 380, WALL.w, WALL.h * k); ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 2; ctx.strokeRect(WALL.x, WALL.y + (1 - k) * 380, WALL.w, WALL.h * k); }
    if (ln > 0) { const sx = Rm.x + Rm.w, sy = Rm.y + Rm.w * .28; F.goldSpan(ctx, [[sx, sy], [WALL.x - 2, sy]], 0, sineIO(ln), { w: 3 }); if (ln >= 1) halo(ctx, WALL.x, sy, 120, .5 * pulse(t, tEndW + .1, .5), GOLD.halo, GOLD.core); }
    ctx.restore();
  }
  // ---------------------------------------------------------------------- lens 4: the fifteen-year-old, the doors, the LINE
  const qSup = B.words(T.GW('a superintelligent', 'fifteen', tPict)); qSup[0].w = '“' + qSup[0].w; qSup[qSup.length - 1].w = qSup[qSup.length - 1].w.replace(/[.”"]+$/, '') + '”';
  function fourth(ctx, t) {
    B.ground(ctx, GY4, 1);
    const tu = span(t, tPict - .1, tPict + 1.1), walk = sineIO(span(t, tEager + .3, tDayAI + .2)), x = lerp(640, 870, walk);
    // the doors (job signs); the first one warms as it gets there
    DOORS.forEach(([name, dx], i) => door(ctx, t, dx, name, span(t, tEager - .2 + i * .15, tEager + .7 + i * .15), i === 0 ? span(walk, .6, 1) : 0));
    // the fifteen-year-old in cool light, with a school bag
    if (tu > 0) {
      const k = expoOut(tu), yy = GY4 + (1 - k) * 420;
      ctx.save(); ctx.beginPath(); ctx.rect(-1000, -800, W + 2000, GY4 + 800); ctx.clip();
      B.topLight(ctx, x, GY4, 340, .75 * k, COOL);
      B.coolFigure(ctx, t, x, yy, 340, { dir: 1, look: .35, bag: true, hood: false, walk: walk > 0 && walk < 1 ? (x - 640) / 40 : undefined, a: clamp(tu * 2) });
      ctx.restore();
    }
    B.spokenQuote(ctx, t, qSup, 960, 170, 60, span(t, tSuper - .4, tSuper + .3) * (1 - span(t, tDayAI - .4, tDayAI)), { align: 'center', maxW: 1600 });
    // its knowledge bar: almost empty
    const kb = span(t, tKnows - .2, tKnows + .5) * (1 - span(t, tDayAI - .2, tDayAI + .3));
    if (kb > 0) {
      const bx = x - 180, by = 360;
      ctx.save(); ctx.globalAlpha *= kb;
      B.caps(ctx, 'WHAT IT KNOWS', bx, by - 16, 24, 1, { col: COOL.text });
      ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 2; ctx.strokeRect(bx, by, 360, 30);
      ctx.fillStyle = COOL.body; ctx.fillRect(bx + 3, by + 3, 354 * .05 * sineIO(span(t, tKnows + .1, tKnows + .8)), 24);
      ctx.restore();
    }
    // the LINE: on the AFTER side ALL JOBS · NO YEAR GIVEN
    const lu = span(t, tDayAI - .1, tDayAI + .9);
    if (lu > 0) {
      F.divider(ctx, t, LINE.x, LINE.y0, LINE.y1, lu, { glow: 1, left: 'BEFORE', right: 'AFTER', lab: span(t, tDayAI + .3, tDayAI + 1.0), size: 34 });
      B.caps(ctx, 'ALL JOBS', 1440, 300, 48, span(t, tDayAI + 1.0, tDayAI + 1.6), { align: 'center', g: 1 });
      B.caps(ctx, 'NO YEAR GIVEN', 1440, 352, 30, span(t, tNoYear - .1, tNoYear + .5), { align: 'center', col: CREAM2 });
    }
  }

  const draw = (ctx, t, cam) => {
    if (t < t0 || t >= tPlate) return;
    const fl = fold(t), fk = 1 - fl;
    // ============================================================== the life line and the two lenses (markers 3 and 4)
    const in3 = span(t, t0 + .1, t0 + 2.2), out3 = span(t, tStill - .9, tStill + .6);
    const in4 = span(t, tPict - .4, tPict + 1.6), out4 = span(t, tHas - .9, tHas + .6);
    const yc = 1 - span(t, t0, t0 + .9);
    const dim = (t) => 1 - .7 * mv(t, tMissing - .4, 1.0) - .3 * mv(t, tToday - .3, 1.0) + mv(t, tFourth - .5, 1.2);
    const outer = (c) => { line6(c, t, { a: clamp(dim(t)) }); if (yc > 0) youChat(c, t, yc, { recipe: yc, chat: yc, thread: yc }); };
    if (in3 <= 0 || (out3 >= 1 && in4 <= 0) || out4 >= 1) outer(ctx);
    else if (out3 < 1) B.fly(ctx, t, cam, M3, out3 > 0 ? 1 - out3 : in3, outer, (c) => third(c, t), { edgeCol: CREAM, zoom: false });
    else B.fly(ctx, t, cam, M4, out4 > 0 ? 1 - out4 : in4, outer, (c) => fourth(c, t), { edgeCol: CREAM, zoom: false });
    // marker flares: 3 lights cream (5.01, 5.06), 4 lights (5.10), the box glows (5.15), the box fills (5.18)
    const f3 = Math.max(pulse(t, t0 + .2), pulse(t, tStill + .5)), f4 = pulse(t, tCan, .6), fb = pulse(t, tHas + .7, .6), f5 = pulse(t, tFive + .2, .7);
    if (f3 > .01) halo(ctx, M3.cx, M3.cy, 150, .55 * f3, CREAM2, CREAM);
    if (f4 > .01) halo(ctx, M4.cx, M4.cy, 170, .6 * f4, CREAM2, CREAM);
    if (fb + f5 > .01) halo(ctx, BOXR.x + BOXR.w / 2, BOXR.y + 30, 190, .5 * fb + .7 * f5, GOLD.halo, GOLD.core);
    // ============================================================== 5.07 THE RECIPE · GOOGLE  ·  5.08 the ring with a gap
    const gU = span(t, tGoogle - .2, tGoogle + .8), gOut = mv(t, tMissing - .3, .9);
    if (gU > 0 && gOut < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - gOut; ctx.translate(0, -expoIn(gOut) * 300);
      F.recipeCard(ctx, t, 640, 250, 340, { u: gU, net: 1, data: .08, head: 'THE RECIPE' });
      F.recipeCard(ctx, t, 1030, 250, 340, { u: span(t, tGoogle, tGoogle + 1.0), net: 1, data: .08 + .2 * sineIO(span(t, tMore - .3, tMore + .7)), head: 'GOOGLE' });
      B.caps(ctx, 'MAY BE GETTING MORE OUT OF IT', 1200, 210, 26, span(t, tMore - .1, tMore + .6), { align: 'center', col: CREAM });
      ctx.restore();
    }
    const rU = mv(t, tMissing - .3, 1.1), toRow = mv(t, tToday - .3, 1.3), rowsOut = mv(t, tFourth - .6, 1.6);
    if (rU > 0 && rowsOut < 1) {
      const rx = lerp(960, 300, toRow), ry = lerp(330, 720, toRow), rr = lerp(160, 72, toRow);
      ctx.save(); ctx.globalAlpha *= 1 - span(rowsOut, .3, .9); ctx.translate(0, rowsOut * 700);
      F.ring(ctx, t, rx, ry + (1 - expoOut(rU)) * 300, rr, { a: clamp(rU * 2), gap: span(t, tMiss - .6, tMiss + .2), think: .5 });
      const gpx = rx + rr * Math.cos(-.6) + 40, gpy = ry + rr * Math.sin(-.6);
      B.caps(ctx, 'STILL MISSING', gpx, gpy, 30, span(t, tMiss - .2, tMiss + .4) * (1 - span(toRow, 0, .3)), { col: CREAM2 });
      // ★ 5.09 the two rows: THE MACHINE needs a wall of thousands; YOU learn from three
      if (toRow > 0) {
        B.caps(ctx, 'THE MACHINE', 300, 840, 28, span(toRow, .5, 1), { align: 'center', col: COOL.text });
        const wf = span(t, tToday + .3, tYouDo - .1), cols = 120, rows = 22, x0 = 470, y0 = 612, cw = 10.6, rh = 10;
        const nCol = Math.floor(cols * expoOut(wf));
        if (nCol > 0) {
          ctx.fillStyle = rgba(COOL.body, .75);
          for (let c = 0; c < nCol; c++) for (let r = 0; r < rows; r++) ctx.fillRect(x0 + c * cw, y0 + r * rh, cw - 2.6, rh - 2.6);
          ctx.fillStyle = rgba(COOL.core, .9); const c = Math.min(cols - 1, nCol); for (let r = 0; r < rows; r++) ctx.fillRect(x0 + c * cw, y0 + r * rh, cw - 2.6, rh - 2.6);
          halo(ctx, x0 + nCol * cw, y0 + rows * rh / 2, 160, .35 * (1 - span(wf, .9, 1)), COOL.halo, COOL.core);
        }
        B.caps(ctx, 'THOUSANDS OF EXAMPLES', x0 + cols * cw, 880, 26, span(wf, .6, 1), { align: 'right', col: COOL.text });
        // YOU: three examples, then a gold tick
        const yu = span(t, tYouDo - .5, tYouDo + .6);
        if (yu > 0) {
          ctx.save(); ctx.beginPath(); ctx.rect(0, -500, W, 900); ctx.clip();
          B.figure(ctx, t, 300, 400, 210, { u: yu, du: true, glow: .3, glowCol: { halo: P.coat, core: P.core1 }, fig: { dir: 1, look: .4 } });
          ctx.restore();
          B.caps(ctx, 'YOU', 300, 450, 28, yu, { align: 'center', col: GOLD.text });
          [0, 1, 2].forEach((i) => photo(ctx, 'cat', 600 + i * 170, 300, 120, span(t, tYouDo + i * .3, tYouDo + .3 + i * .3)));
          B.caps(ctx, '3 EXAMPLES', 770, 420, 26, span(t, tFew - .3, tFew + .3), { align: 'center', col: CREAM });
          B.tick(ctx, 1080, 300, 90, span(t, tFew + .1, tFew + .8));
        }
      }
      ctx.restore();
    }
    // ============================================================== 5.16 the question card · 5.17 C3 out of the number box · 5.18 5–20 YEARS
    const qc = span(t, tPod - .1, tPod + .9) * (1 - span(t, cs - 1.2, cs - .4));
    if (qc > 0) {
      const R = { x: 280, y: 200, w: 860, h: 176 }, k = expoOut(qc);
      ctx.save(); ctx.globalAlpha *= clamp(qc * 3); ctx.translate(0, (1 - k) * -60);
      ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(R.x + 10, R.y + 14, R.w, R.h);
      ctx.fillStyle = lin(ctx, R.x, R.y, R.x + R.w, R.y + R.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(R.x, R.y, R.w, R.h);
      ctx.fillStyle = mixHex(PAPER.ink, GOLD.deep, .3); ctx.fillRect(R.x, R.y, 12, R.h);
      B.caps(ctx, 'HOW LONG UNTIL A MACHINE', R.x + 50, R.y + 74, 38, span(t, tHowLong - .3, tHowLong + .4), { col: PAPER.ink, spacing: .06 });
      B.caps(ctx, 'LEARNS AS WELL AS A PERSON?', R.x + 50, R.y + 128, 38, span(t, tHowLong + .3, tHowLong + 1.0), { col: PAPER.ink, spacing: .06 });
      F.dateTag(ctx, R.x, R.y + R.h + 30, F.SOURCES.podcast, span(t, tPod + .6, tPod + 1.3));
      F.goldSpan(ctx, [[R.x + R.w, R.y + R.h * .6], [BOXR.x, BOXR.y + 30]], 0, sineIO(span(t, tHowLong + .8, tHowLong + 1.8)), { w: 1.2, spark: false, a: .7 });
      ctx.restore();
    }
    const m = span(t, cs - 2.3, cs) * (1 - span(t, ce, ce + 1.9));
    if (m > 0) {
      { ctx.save(); ctx.globalAlpha *= sineIO(span(m, 0, .25)); F.clipPlate(ctx, t, T, 'C3', { from: S.rectToScreen(cam, BOXR), morph: m, dark: 1 - sineIO(span(m, 0, .55)) }); ctx.restore(); }
      if (m > .97) B.softCuts(ctx, t, T, 'C3', C3CUTS);   // the podcast's own camera switches dissolve (calm.py: 0 cuts)
      const pu = span(t, cs + .7, cs + 1.3) * (1 - span(t, ce - .3, ce)) * span(m, .9, 1);
      if (pu > 0) {   // the caption pill inside the plate, bottom right (above y 880)
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= pu;
        const txt = F.SOURCES.learnsLike, sz = 26, tw = measure(txt, sz, false, 700) + txt.length * sz * .08, x1 = 1760, y = 840;
        ctx.fillStyle = rgba(P.night0, .78); ctx.beginPath(); ctx.roundRect(x1 - tw - 36, y - sz - 14, tw + 56, sz + 30, 22); ctx.fill();
        ctx.strokeStyle = rgba(GOLD.line, .7); ctx.lineWidth = 1.5; ctx.stroke();
        F.goldText(ctx, [[txt, .7]], x1 - tw - 8, y, sz, rise(pu), { serif: false, weight: 700, spacing: .08 });
        ctx.restore();
      }
    }
    const lab = span(t, tFive + .2, tFive + .9) * (1 - span(t, tUntil + .4, tUntil + 1.2));
    B.caps(ctx, 'A MACHINE THAT LEARNS LIKE A HUMAN', X25, BOXR.y - 34, 26, lab, { align: 'center', col: CREAM });
    // ============================================================== 5.19–5.27 the future axis, the span, you and the child, the fold
    const ax = span(t, tUntil - .2, tUntil + 1.6);
    if (ax > 0 && fl < 1) {
      const fx = (x) => (x <= R0.x1 ? x : R0.x1 + (x - R0.x1) * fk), fa = 1 - span(fl, 0, .55);
      ctx.save(); ctx.globalAlpha *= fa;
      // the axis (dashed cream) and the year ticks
      ctx.strokeStyle = rgba(CREAM2, .7); ctx.lineWidth = 4; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(R0.x1 + 6, LY); ctx.lineTo(fx(lerp(R0.x1, 4500, sineIO(ax))), LY); ctx.stroke(); ctx.setLineDash([]);
      [2030, 2035, 2040, 2045].forEach((yr, i) => {
        const x = fx(XY(yr)), k = span(ax, .3 + i * .12, .55 + i * .12); if (k <= 0) return;
        const hot = yr === 2045 ? span(t, tTwenty - .2, tTwenty + .4) : 0;
        ctx.fillStyle = rgba(CREAM, .8 * k); ctx.fillRect(x - 1.5, LY + 60, 3, 26);
        F.goldText(ctx, [[String(yr), hot]], x, LY + 150, 66, rise(k), { serif: true, align: 'center', col: CREAM });
        if (hot > 0) halo(ctx, x, LY, 340, .5 * hot, GOLD.halo, GOLD.hot);
      });
      // the span 2030 → 2045 (gold band), FORECAST · NOT FACT, the far end frays into fog
      const sp = span(t, tUntil + .3, tUntil + 1.8), x30 = fx(XY(2030)), x45 = fx(XY(2045));
      if (sp > 0) {
        const xe = lerp(x30, x45, sineIO(sp)), fog = span(t, tHard - .2, tHard + 1.6);
        ctx.fillStyle = lin(ctx, x30, 0, x45, 0, [[0, rgba(GOLD.body, .55)], [.8, rgba(GOLD.body, .55 - .35 * fog)], [1, rgba(GOLD.body, .4 - .38 * fog)]]); ctx.fillRect(x30, LY - 46, xe - x30, 38);
        F.goldText(ctx, [['5–20 YEARS', 1]], (x30 + x45) / 2, LY - 76, 72, rise(span(sp, .5, 1)) * (1 - span(t, tAge - .4, tAge)), { serif: true, align: 'center' });
        if (fog > 0) { const r = prng(5); for (let i = 0; i < 70; i++) { const fx0 = x45 - 260 + r() * 520, fy = LY - 60 + r() * 110 + Math.sin(t * .7 + i) * 8; halo(ctx, fx0 + Math.sin(t * .3 + i) * 20, fy, 40 + r() * 60, .09 * fog, CREAM2, CREAM); } }
      }
      B.caps(ctx, 'FORECAST', fx(XY(2037.5)), LY - 220, 70, span(t, tFore + .2, tFore + .8) * (1 - span(t, tAge - .4, tAge)), { align: 'center', col: CREAM });
      B.caps(ctx, 'NOT FACT', fx(XY(2037.5)), LY - 160, 44, span(t, tNotFact - .1, tNotFact + .5) * (1 - span(t, tAge - .4, tAge)), { align: 'center', col: CREAM2 });
      // grey markers of other forecasts land further right
      [3470, 3600, 3740, 3870].forEach((x, i) => {
        const d = expoOut(span(t, tDoubt + .5 + i * .2, tDoubt + 1.1 + i * .2)); if (d <= 0) return;
        const yy = LY - (1 - d) * 160; ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.beginPath(); ctx.arc(fx(x), yy, 22, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba(CREAM2, .7); ctx.lineWidth = 2.5; ctx.stroke();
      });
      B.caps(ctx, 'OTHER FORECASTS', fx(3670), LY - 80, 40, span(t, tDoubt + 1.0, tDoubt + 1.6) * (1 - span(t, tAge - .4, tAge)), { align: 'center', col: CREAM2 });
      // 5.24 YOUR WORKING LIFE (the band label), AGE 45 → AGE 65
      const wl = span(t, tLife - .5, tLife + .3) * (1 - span(t, tChild - .3, tChild + .3));
      B.caps(ctx, 'YOUR WORKING LIFE', (x30 + x45) / 2, LY - 160, 64, wl, { align: 'center', g: 1 });
      // 5.25 the child: STARTS WORK
      const cu = span(t, tChild - .2, tChild + .6) * (1 - span(fl, 0, .35)), cw = sineIO(span(t, tChild + .3, tStarts + .2)), cx = lerp(X25, XY(2036), cw);
      if (cu > 0) {
        ctx.save(); ctx.globalAlpha *= cu; halo(ctx, fx(cx), LY - 70, 170, .3, P.coat, P.core1);
        E.du(ctx, fx(cx), LY + 4, 140, { light: 1, look: .4, dir: 1, walk: cw > 0 && cw < 1 ? cw * 26 : undefined });
        ctx.restore();
        B.caps(ctx, 'STARTS WORK', fx(XY(2036)), LY - 230, 50, span(t, tStarts - .2, tStarts + .4) * (1 - span(fl, 0, .35)), { align: 'center', g: .7 });
        if (span(t, tStarts - .2, tStarts + .4) > 0) { ctx.fillStyle = rgba(GOLD.line, .7 * cu); ctx.fillRect(fx(XY(2036)) - 1.5, LY - 205, 3, 160); }
      }
      ctx.restore();
      // 5.26 the end warms like dawn
      const dw = dawn(t) / .35;
      if (dw > 0) halo(ctx, fx(XY(2045)), LY, 700 * (.5 + .5 * dw), .35 * dw * fk, GOLD.halo, GOLD.hot);
    }
    // you: walk the span (5.24), stand at its end, turn back; the fold carries you to the record picture's end (h 92, dir −1, x1 + 40)
    const yIn = span(t, tAge - .4, tAge + .4);
    if (yIn > 0) {
      const fx = (x) => (x <= R0.x1 ? x : R0.x1 + (x - R0.x1) * fk);
      const wk = sineIO(span(t, tAge + .2, tLife + .3)), xw = lerp(X25, XY(2045), wk);
      const x = lerp(fx(xw), R0.x1 + 40, fl), h = lerp(220, 92, sineIO(fl)), dir = t >= tCond - .3 ? -1 : 1;
      const ag = (1 - span(fl, 0, .3));
      halo(ctx, x, LY - h * .5, h * 1.2, .25 * yIn * (1 - fl), P.coat, P.core1);
      E.du(ctx, x, LY + 4 + (1 - expoOut(yIn)) * 0, h * expoOut(yIn), { light: 1, look: .5, dir, walk: wk > 0 && wk < 1 ? wk * 40 : undefined });
      B.caps(ctx, 'AGE 45', X25, LY - 270, 56, yIn * (1 - span(wk, .1, .3)) * ag, { align: 'center', g: .4 });
      B.caps(ctx, 'AGE 65', XY(2045), LY - 270, 56, span(wk, .85, 1) * ag * (1 - span(t, tChild - .3, tChild + .2)), { align: 'center', g: .4 });
    }
    // 5.27 1 CONDITION (the knot itself is in the life line)
    B.caps(ctx, '1 CONDITION', S.RECORD.x0 + (R0.x1 - R0.x0) * .95 - 16, LY + 74, 28, span(t, tCond + .1, tCond + .7) * (1 - span(t, tPlate - .7, tPlate - .25)), { g: 1 });
  };
  return { keys, draw, dawn };
}
