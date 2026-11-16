// Film 54 · B2 · ONE continuous take for c06 c07 c08 c09 ('The third disease answers fast' → 'He even warned of a jam').
// The four scene files (scenes/sc06.mjs … sc09.mjs) return ONE entry each with the SAME draw function from here, so the inner chunk
// boundaries (c06|c07, c07|c08, c08|c09) are the same picture by construction. In: S.plateMind (B1 → B2). Out: S.plateKiosk (B2 → B3).
// Plan: docs/shots.md 4.01–6.10 · world: docs/MOTION.md · props: lib/f54_b2_props.mjs. Anchors are phrases only (T.G / T.GE / T.clip).
//
// | ID   | anchor                              | picture (one idea)                                                          | camera / layer            |
// |------|-------------------------------------|-----------------------------------------------------------------------------|---------------------------|
// | 4.01 | The third disease answers fast      | out of plateMind; MIND lights; the quiet rings drown in a field of noise    | push into V3 · EXPL       |
// | 4.02 | Take depression                     | through the glass (the rings open): a waiting room, two groups; both lift   | dive · SCENE (QR quiet)   |
// | 4.03 | Even for the antidepressants        | out of the glass: 74 trial cards fly out of the vitrine; 38 turn mint       | pull back · EXPL          |
// | 4.04 | And there's no blood test           | the cards gather into one sheet: a questionnaire, ticks; an empty tube      | creep · EXPL              |
// | 4.05 | That doesn't make it hopeless       | the sheet turns over: the essay page "Most mental illness can probably…"    | creep · EXPL              |
// | 4.06 | So mental illness, by the deadline  | board ?; the page steps aside; the scan; an empty frame waits               | creep · EXPL              |
// | 4.07 | And then the fourth disease         | the things go home into V3; truck right to V4 (the brain)                   | truck · HALL              |
// | 5.01 | The changes in the brain            | a tiny point glows in the brain: CHANGES CAN BEGIN 20+ YEARS BEFORE SYMPTOMS | push · EXPL               |
// | 5.02 | That means many people              | the glass opens on a street of today; the point drops into some passers-by  | pull back · MIX           |
// | 5.03 | So the medicine has to come         | healthy people in rows; a tally, one mark a year; some get sick             | truck · EXPL              |
// | 5.04 | One such trial waited               | the tally runs to almost five; a vial: A4 (SOLANEZUMAB) · 240 WEEKS · FAILED | creep · EXPL             |
// | 5.05 | And for those already sick          | truck to the lectern; the essay opens; the magnifier: "…difficult to reverse"| truck + dive · EXPL      |
// | 5.06 | The line in the sales video doesn't | out to the wall panel: the frame unfolds into C1, "Alzheimer's" in mint     | pull back · EXPL          |
// | 5.07 | So Alzheimer's, by the deadline     | board ✗; V4 joins the frame, its trace glows: it has already begun         | glide left · MIX          |
// | 5.08 | But the race doesn't start          | the trace flies into a blood tube: FIRST ALZHEIMER'S BLOOD TEST CLEARED     | creep · EXPL              |
// | 5.09 | So if the machines aren't           | C1 folds back into the frame; NOV 10, 2026 lights                          | glide · MIX               |
// | 6.01 | Partly, because a sales pitch       | through the frame: a stage, a spotlight on 2036 (no person)                 | dive · SCENE              |
// | 6.02 | The Nobel Prize-winning biologist   | out, truck right to the audio-guide post; its light wakes                  | truck · HALL              |
// | 6.03 | [C5]                                | the speaker grows into the audio plate (no portrait), mint waveform        | creep · CLIP              |
// | 6.04★| The testing, not the finding        | the plate collapses into THE GLASS PIPELINE: FINDING streams, TESTING narrows| creep · EXPL            |
// | 6.05 | The other reason for Amodei's date  | the two-dates label rises from the neck: PROVEN, an arrow forward, ?        | creep · EXPL              |
// | 6.06 | The cardiologist Eric Topol         | a wall card: "…wildly off-base…" (K6: + AUG 2026)                           | creep · EXPL              |
// | 6.07 | To be fair                          | a second card: "…actually curing cancer."                                  | creep · EXPL              |
// | 6.08 | His own company now designs         | a molecule runs a short bright path to a mouse; FOUND stamps               | creep · EXPL              |
// | 6.09 | Its human trials could start        | it joins a long queue before HUMAN TRIALS · AS SOON AS LATE 2028            | creep · EXPL              |
// | 6.10 | Same road as everyone else          | the queue rolls on; first date fast, second years away; the label goes into the kiosk screen → plateKiosk | settle · HALL |
import * as E from './f10_editorial.mjs';
import * as F from './f54_kit.mjs';
import * as S from './f54_seams.mjs';
import * as B from './f54_b2_props.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, mixHex, smooth } = E;
const { rise, maskLine, F0, MINT, COOL, LAMP, RELIC } = F;
const TAU = Math.PI * 2;

const C = (u, v, s, sx, sy) => E.aim(F0, u, v, s, sx, sy);
const G3 = S.glassOf(2), G4 = S.glassOf(3), FR = S.frameRect(), SP = S.postSpeaker(), KS = S.kioskScreen();
const L4 = (lx, ly) => [G4.x + lx, G4.y + ly], L3 = (lx, ly) => [G3.x + lx, G3.y + ly];
const RINGS = [330, 324];                                 // the mind specimen centre (V3 local)
const TRACE = [390, 290];                                 // the first trace in the brain (V4 local)
const TEXT = { x: 4990, y: 360, w: 1260, size: 76 };      // the C1 wall text (hall px), as in c01
const PIPE = { x: 140, y: 590, w: 1640, h: 230 };          // 6.04 the glass pipeline (screen)
const PIPE_LOW = { x: 300, y: 800, w: 1320, h: 110 };      // 6.05 it steps down
const LBL = { x: 880, y: 210, s: 1 }, LBL_C9 = { x: 92, y: 474, s: .78 };

const float = (ctx, t, k = 1) => { ctx.setTransform(1, 0, 0, 1, 0, 0); const z = 1 + .026 * k * Math.sin(t * .5 + 2.6), dx = 30 * k * Math.cos(t * .5 + 1), dy = 16 * k * Math.sin(t * .5 + 1);
  ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); };
const veil = (ctx, a) => { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, a); ctx.fillRect(0, 0, W, H); ctx.restore(); };
// a dark museum panel that grows out of a source rect (a plaque, a point) and goes back into it (c01 H.07 language)
const lerpR = (A, Bq, m) => ({ x: lerp(A.x, Bq.x, m), y: lerp(A.y, Bq.y, m), w: lerp(A.w, Bq.w, m), h: lerp(A.h, Bq.h, m) });
function panelBox(ctx, r, al = 1) {
  if (al <= 0 || r.w < 2) return; ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = rgba(mixHex(P.night1, P.ind2, .5), .95); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, Math.min(14, r.w * .03, r.h / 2)); ctx.fill();
  ctx.strokeStyle = rgba(P.cream, .4); ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = rgba(LAMP.body, .45); ctx.fillRect(r.x + 40, r.y + 28, Math.min(48, r.w * .1), 2); ctx.restore();
}
const label2 = (ctx, x, y, l1, l2, u, o = {}) => {   // a pinned label in screen px: a mint line up-right, cream line + mint line
  u = clamp(u); if (u <= 0) return; const dx = o.dx ?? 90, dy = o.dy ?? -90, x1 = x + dx, y1 = y + dy;
  F.mintSpan(ctx, [[x, y], [x1, y1], [x1 + 30, y1]], 0, smooth(clamp(u * 1.6)), { w: 1.6, spark: false });
  maskLine(ctx, [[l1, 0]], x1 + 40, y1 - 12, o.s1 ?? 26, u, { serif: false, weight: 600, col: P.cream, glow: false });
  maskLine(ctx, [[l2, 0]], x1 + 40, y1 + 30, o.s2 ?? 32, rise(span(u, .25, 1)), { serif: false, weight: 600, col: MINT.text, glow: false });
};

const CACHE = new WeakMap();
export function take(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  // ---- c06 (MIND)
  a.T0 = G('The third disease answers fast'); a.hearing = G('hearing the answer', a.T0); a.take = G('Take depression', a.T0);
  a.trial = G('A trial runs for weeks', a.take); a.improve = G('improve on a sugar', a.trial); a.sugar = G('sugar pill too', a.trial);
  a.even = G('Even for the antidepressants', a.trial); a.half = G('about half the trials', a.even); a.noblood = G("And there's no blood test", a.even);
  a.quest = G('The diagnosis is a questionnaire', a.noblood); a.qEnd = GE('The diagnosis is a questionnaire', a.noblood);
  a.hope = G("That doesn't make it hopeless", a.quest); a.essay = G('In his essay', a.hope); a.most = G('most mental illness', a.hope);
  a.soMind = G('So mental illness, by the deadline', a.most); a.scan = G('Cancer has its scan', a.soMind); a.waiting = G('The mind is still waiting', a.scan);
  a.fourth = G('And then the fourth disease', a.waiting); a.starts = G('It starts long before it shows', a.fourth); a.alz = G("Alzheimer's", a.starts);
  // ---- c07 (ALZHEIMER'S)
  a.changes = G('The changes in the brain', a.alz); a.twenty = G('twenty years before', a.changes); a.means = G('That means many people', a.changes);
  a.traces = G('carry the first traces', a.means); a.soMed = G('So the medicine has to come', a.means); a.symptoms = G('before the symptoms', a.soMed);
  a.proving = G('Proving that means following', a.soMed); a.forYears = G('for years', a.proving); a.counting = G('counting who', a.proving);
  a.oneSuch = G('One such trial waited', a.counting); a.waited = G('waited years', a.oneSuch); a.didnt = G("The drug didn't work", a.oneSuch);
  a.sick = G('And for those already sick', a.didnt); a.existing = G('existing damage', a.sick); a.line = G('The line in the sales video', a.sick);
  a.mention = G('mention that either', a.line); a.soAlz = G("So Alzheimer's, by the deadline", a.line); a.begun = G('it has already begun', a.soAlz);
  // ---- c08 (THE RACE · WHY A DATE · C5 · THE PIPELINE)
  a.race = G("But the race doesn't start", a.begun); a.btest = G('a blood test can spot', a.race); a.firstTr = G('the first traces', a.btest);
  a.why = G("So if the machines aren't the slow part", a.btest); a.date = G('why set a date', a.why);
  a.partly = G('Partly, because a sales pitch', a.why); a.promise = G('a promise with a date', a.partly); a.villain = G('No villain needed', a.partly);
  a.nobel = G('The Nobel Prize-winning biologist', a.villain); a.venki = G('Venki Ramakrishnan', a.nobel); a.named = G('named the slow part', a.nobel);
  a.C5 = T.clip('C5'); a.testing = G('The testing, not the finding', a.named); a.finding = G('the finding', a.testing);
  a.other = G("The other reason for Amodei's date", a.testing); a.betting = G("he's betting", a.other); a.speed = G('speed up too', a.other);
  // ---- c09 (TOPOL · AMODEI · THE MOUSE · THE QUEUE)
  a.topol = G('The cardiologist Eric Topol', a.other); a.eric = G('Eric Topol', a.topol); a.wild = G('wildly off-base', a.topol);
  a.fair = G('To be fair, Amodei holds', a.topol); a.amodei = G('Amodei holds', a.fair); a.august = G('In August, he wrote', a.fair); a.curing = G('actually curing cancer', a.august);
  a.company = G('His own company now designs', a.august); a.muscular = G('muscular dystrophy', a.company); a.idea = G('from idea to promising', a.company);
  a.mice = G('results in mice', a.company); a.months = G('under eighteen months', a.company);
  a.its = G('Its human trials could start', a.company); a.late = G('late twenty twenty-eight', a.its);
  a.same = G('Same road as everyone else', a.its); a.first = G('First date', a.same); a.fast = G('fast', a.first); a.second = G('Second date', a.first); a.away = G('years away', a.second);
  a.end = G('He even warned of a jam', a.away);
  const out = { a, draw: scene(a, T) };
  CACHE.set(T, out);
  return out;
}

function scene(a, T) {
  const T0 = a.T0, tIn = T0 + S.SEAM_HALF, tPlate = a.end - S.SEAM_HALF, tCreep = tPlate - 2.5;
  // ================================================================== the camera (one take)
  const mindCreep = (t) => C(3440 + S.TRUCK * (t - T0 + S.SEAM_HALF), 500, 1.15 * (1 + S.CREEP * (t - T0 + S.SEAM_HALF)), 860, 560);
  const kioskCreep = (t) => C(7360 + S.TRUCK * (t - tPlate), 560, 1.05 * (1 + S.CREEP * (t - tPlate)));
  const ROOMC = C(3428, 597, 2.62);
  const K = [
    [tIn - 1, mindCreep(tIn - 1)], [tIn, mindCreep(tIn)], [tIn + 1, mindCreep(tIn + 1)],
    [a.take - .3, C(3440, 434, 1.72, 900, 520)], [a.take + 2.3, ROOMC], [a.even - .2, C(3454, 594, 3.0)],
    [a.even + 2.6, C(3462, 470, 1.05, 960, 560)], [a.essay, C(3468, 473, 1.09, 960, 560)], [a.soMind + .2, C(3473, 478, 1.13, 960, 560)],
    [a.scan - .3, C(3478, 540, 1.45, 960, 560)], [a.waiting + 1.4, C(3484, 530, 1.38, 960, 560)],
    [a.fourth + 3.4, C(4440, 440, 1.3)], [a.alz, C(4440, 432, 1.55)], [a.changes + 1.6, C(4480, 420, 2.3, 900, 560)], [a.means, C(4492, 418, 2.42, 900, 560)],
    [a.means + 2.0, C(4440, 470, 1.6)], [a.soMed, C(4440, 478, 1.56)], [a.soMed + 2.0, C(4440, 470, 1.15)], [a.sick, C(4470, 470, 1.18)],
    [a.sick + 2.8, C(6560, 530, 1.4)], [a.existing + .6, C(6668, 515, 4.4, 1180, 610)], [a.line, C(6672, 516, 4.55, 1180, 610)],
    [a.line + 2.6, C(5560, 430, .95)], [a.soAlz + .3, C(5540, 430, .94)], [a.begun + 1.6, C(5150, 430, .72)], [a.race + 1, C(5140, 430, .72)],
    [a.why, C(5200, 440, .84)], [a.why + 2.6, C(5600, 470, 1.0)], [a.partly, C(5600, 470, 1.04)], [a.partly + 2.6, C(5600, 470, 3.05)],
    [a.villain + .3, C(5614, 472, 3.32)], [a.villain + 2.8, C(6150, 500, 1.0)], [a.venki + 1.6, C(7650, 560, 1.0)], [a.named, C(7800, 575, 1.18)],
    [a.C5.start, C(7810, 578, 1.22)], [a.C5.end, C(7790, 572, 1.26)], [a.topol, C(7760, 520, 1.2)], [a.company, C(7700, 526, 1.28)], [a.same, C(7440, 542, 1.1)],
    [tCreep, kioskCreep(tCreep)],
  ];
  const camRaw = (t) => (t < tCreep ? F.camPath(t, K) : kioskCreep(t));
  const cam = (t) => { const c = camRaw(t), s = F0 / (F0 - c.z), g = smooth(span(t, tIn, tIn + 2.5)) * (1 - smooth(span(t, tPlate - 2.2, tPlate)));
    // drift as a slow ellipse in quadrature (lateral ±60 px on screen, scale ±2.5 %): its speed never reaches zero, so holds stay alive
    const d = E.camDrift(c, t, 3 / Math.max(1, s) * g, 7), ph = .5 * t, s2 = s * (1 + .025 * g * Math.sin(ph));
    return { ...d, x: d.x + 60 * g / s * Math.cos(ph), y: d.y + 10 * g / s * Math.sin(ph * .5), z: d.z + (F0 * (1 - 1 / s2) - c.z) }; };
  const proj = (c, x, y) => E.project(c, F0, x, y);

  // ================================================================== c06 · THE MIND
  const iris = (t) => sineIO(span(t, a.take - .1, a.take + 2.2)) * (1 - sineIO(span(t, a.fourth + .1, a.fourth + 1.5)));
  const noiseA = (t) => smooth(span(t, a.hearing - .2, a.hearing + .8)) * (1 - span(t, a.take + .4, a.take + 1.6));
  function mindInside(cx, t, w, h) {
    const ir = iris(t);
    if (ir < 1) {
      F.specimen(cx, t, 'mind', RINGS[0], RINGS[1], w * .3, { seed: 56 });
      B.noiseField(cx, t, RINGS[0], RINGS[1], 190, noiseA(t));
    }
    if (ir > 0) {
      const r = ir * 760;
      cx.save(); cx.beginPath(); cx.arc(RINGS[0], RINGS[1], r, 0, TAU); cx.clip();
      B.waitingRoom(cx, t, w, h, { sweep: span(t, a.trial + .3, a.trial + 4.2), lift: [span(t, a.improve - .3, a.improve + 1.6), span(t, a.sugar - .1, a.sugar + 1.7)] });
      cx.restore();
      if (ir < 1) { cx.strokeStyle = rgba(MINT.line, .6 * Math.sin(Math.PI * ir)); cx.lineWidth = 3; cx.beginPath(); cx.arc(RINGS[0], RINGS[1], r, 0, TAU); cx.stroke(); }
    }
  }
  // 4.03 the 74 cards fly out of the vitrine's glass
  const CARDS = { x: 520, y: 300, cols: 10, cw: 56, ch: 38, gap: 12 }, SHEET = [1080, 548];
  const cardsFly = (t) => span(t, a.even + .9, a.even + 3.2), cardsFlip = (t) => span(t, a.half - .1, a.half + 1.5), cardsGather = (t) => span(t, a.noblood + .1, a.noblood + 1.1);
  const sheetGrow = (t) => expoOut(span(t, a.noblood + .8, a.noblood + 1.8)), flipU = (t) => sineIO(span(t, a.essay - .1, a.essay + .9));
  const sheetAway = (t) => sineIO(span(t, a.soMind + .1, a.soMind + 1.3));
  const homeV3 = (t) => sineIO(span(t, a.fourth + .05, a.fourth + 1.4));
  function mindExplainers(ctx, t, c) {
    if (t < a.even + .8 || t > a.fourth + 1.5) return;
    const gp = proj(c, G3.cx, G3.cy), hm = homeV3(t), toHome = (x, y, s) => [lerp(x, gp[0], hm), lerp(y, gp[1], hm), s * (1 - .85 * hm)];
    ctx.save(); float(ctx, t, 1 - hm); ctx.globalAlpha = 1 - span(hm, .7, 1);
    // the cards and the number
    const gth = cardsGather(t);
    if (gth < 1) {
      B.trialCards(ctx, t, { ...CARDS, from: [gp[0] - 28, gp[1] - 19], fly: cardsFly(t), flip: cardsFlip(t), gather: gth, to: SHEET });
      const nu = rise(span(t, a.half + .3, a.half + 1.1)) * (1 - expoIn(span(t, a.noblood - .2, a.noblood + .4)));
      if (nu > 0) {
        F.mintText(ctx, [['38', .8], [' OF 74', 0]], 1290, 476, 112, nu);
        maskLine(ctx, [['TRIALS POSITIVE (51 %)', 0]], 1296, 534, 30, rise(span(t, a.half + .6, a.half + 1.4)) * (1 - expoIn(span(t, a.noblood - .2, a.noblood + .4))), { serif: false, weight: 600, col: P.cream, glow: false });
        maskLine(ctx, [['FDA REVIEWS', 0]], 1296, 574, 22, rise(span(t, a.half + .9, a.half + 1.7)) * (1 - expoIn(span(t, a.noblood - .2, a.noblood + .4))), { serif: false, weight: 600, col: P.halo2, glow: false });
      }
    }
    // the empty blood tube (drawn up from its base) beside the sheet
    const tu = span(t, a.noblood + .3, a.noblood + 1.3), tOut = sineIO(span(t, a.hope + .05, a.hope + .9));
    if (tu > 0 && tOut < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - tOut; ctx.translate(0, tOut * 60);
      ctx.save(); ctx.beginPath(); ctx.rect(600, 780 - 380 * expoOut(tu), 320, 400); ctx.clip();
      F.bloodTube(ctx, t, 760, 780, 360, { fill: 0, glow: 0 });
      ctx.restore(); ctx.restore();
    }
    // the sheet: questionnaire → essay page → steps aside
    const sg = sheetGrow(t);
    if (sg > 0) {
      const fl = flipU(t), sa = sheetAway(t);
      let w = lerp(30, lerp(380, 560, fl), sg), h = lerp(20, 480, sg), x = SHEET[0], y = SHEET[1];
      x = lerp(x, 1160, fl * (1 - sa)); [x, y] = [lerp(x, 330, sa), lerp(y, 690, sa)]; w *= lerp(1, .42, sa); h *= lerp(1, .42, sa);
      const [hx, hy, hs] = toHome(x, y, 1);
      B.sheet(ctx, t, hx, hy, w * hs, h * hs, { flip: fl, ticks: span(t, a.quest + .2, a.qEnd + .9), quote: span(t, a.most - .1, a.most + 2.2), rot: -.03 * sa });
    }
    // 4.06 the scan (cancer has its scan) and the empty frame the mind waits for: each slides out from behind the one before
    const su = sineIO(span(t, a.scan - .1, a.scan + .9)), du = sineIO(span(t, a.waiting - .1, a.waiting + .9));
    if (du > 0) { const [x, y, s] = toHome(lerp(800, 1250, du), 570, 360); B.dashedFrame(ctx, t, x, y, s, { a: span(du, 0, .2) }); }
    if (su > 0) { const [x, y, s] = toHome(lerp(330, 800, su), lerp(690, 570, su), lerp(160, 360, su)); F.scan(ctx, t, x, y, s, { tumor: .35 + .05 * Math.sin(t * .8), a: span(su, 0, .2) }); }
    ctx.restore();
  }

  // ================================================================== c07 · ALZHEIMER'S
  const street = (t) => sineIO(span(t, a.means + .1, a.means + 1.9));
  const traceGrow = (t) => span(t, a.changes + .1, a.means + 2);
  function brainInside(cx, t, w, h) {
    const st = street(t), ghost = .7 * st;
    F.specimen(cx, t, 'brain', w / 2, h * .47, w * .26, { seed: 57, ghost, a: 1 - .5 * st });
    if (st > 0) { cx.save(); cx.beginPath(); cx.arc(TRACE[0], TRACE[1], st * 900, 0, TAU); cx.clip(); B.streetToday(cx, t, w, h, { traces: span(t, a.traces + .9, a.traces + 1.9), walk: t - a.means }); cx.restore(); }
    // the trace: a tiny point that grows very slowly; later it glows again ("it has already begun") and flies to the blood tube
    const g = traceGrow(t), again = smooth(span(t, a.begun - .2, a.begun + .8)), gone = span(t, a.race + .3, a.race + .5);
    if (g > 0 && gone < 1) {
      const r = lerp(1.5, 7, g) * (1 + .1 * Math.sin(t * 2)), al = (.55 + .45 * Math.max(.2 + .8 * (1 - st), again)) * (1 - gone);
      halo(cx, TRACE[0], TRACE[1], r * 7 * (1 + again), .45 * al, MINT.halo, MINT.core); cx.fillStyle = rgba(MINT.core, al); cx.beginPath(); cx.arc(TRACE[0], TRACE[1], r, 0, TAU); cx.fill();
    }
    // 5.02 copies of the point drop into three passers-by
    const du = span(t, a.traces - .1, a.traces + 1.1);
    if (du > 0 && du < 1) B.TRACED.forEach((i, j) => { const v = sineIO(span(du, j * .15, j * .15 + .7)); if (v <= 0 || v >= 1) return; const [hx, hy] = B.walkerHead(t, i, w, t - a.means); const x = lerp(TRACE[0], hx, v), y = lerp(TRACE[1], hy, v) - 60 * Math.sin(Math.PI * v); halo(cx, x, y, 18, .5, MINT.halo, MINT.core); cx.fillStyle = MINT.core; cx.beginPath(); cx.arc(x, y, 2.5, 0, TAU); cx.fill(); });
  }
  const COH = { x: 640, y: 660, cols: 6, rows: 2, dx: 118, dy: 62, h: 168 }, TAL = { x: 620, y: 772, pitch: 96, h: 56 }, VIAL = [1560, 730, 240];
  function alzExplainers(ctx, t, c) {
    // 5.01 the label pinned to the trace (screen space)
    const lu = rise(span(t, a.twenty - .3, a.twenty + .6)) * (1 - expoIn(span(t, a.means + .1, a.means + .7)));
    if (lu > 0) { const [x0, y0] = L4(...TRACE), p = proj(c, x0, y0); if (p) label2(ctx, p[0] + 10, p[1] - 10, 'CHANGES CAN BEGIN', '20+ YEARS BEFORE SYMPTOMS', lu, { dx: 110, dy: -120 }); }
    if (t < a.soMed || t > a.sick + 1.4) return;
    const out = sineIO(span(t, a.sick + .05, a.sick + 1.2)), pm = sineIO(span(t, a.soMed + .2, a.soMed + 1.3)) * (1 - out);
    const pq = S.plaqueOf(3), pp = proj(c, pq.x - pq.s / 2, pq.y - pq.h / 2), from = pp ? { x: pp[0], y: pp[1], w: pq.s * pp[2], h: pq.h * pp[2] } : { x: 960, y: 800, w: 10, h: 4 };
    ctx.save(); float(ctx, t, pm); panelBox(ctx, lerpR(from, { x: 540, y: 250, w: 1270, h: 610 }, pm), span(pm, 0, .15)); ctx.globalAlpha = span(pm, .8, 1);
    B.cohort(ctx, t, { ...COH, rise: span(t, a.symptoms - .4, a.symptoms + 1.4), sick: span(t, a.counting, a.counting + 2.0) });
    // the tally: one mark a year (no clock, no calendar), then on to almost five; the line runs on to the vial
    const n1 = span(t, a.forYears - .3, a.forYears + 2.3) * 3, n2 = span(t, a.waited - .2, a.waited + 1.4) * 1.6, n = n1 + n2;
    const line = span(t, a.forYears - .8, a.forYears) * (TAL.pitch * 3 + 40) + span(t, a.waited - .3, a.waited + 1.6) * (VIAL[0] - 120 - TAL.x - TAL.pitch * 3);
    if (line > 0) B.tally(ctx, t, { ...TAL, n, last: n > 4 ? .62 : null, len: line + 20 });
    const wk = rise(span(t, a.waited + 1.2, a.waited + 1.9));
    if (wk > 0) maskLine(ctx, [['240 WEEKS', 0]], TAL.x + TAL.pitch * 4.3, TAL.y + 58, 26, wk, { serif: false, weight: 600, col: P.cream, glow: false });
    const vu = rise(span(t, a.oneSuch + .2, a.oneSuch + 1.1));
    if (vu > 0) {
      ctx.save(); ctx.globalAlpha *= vu; ctx.translate(0, (1 - vu) * 40);
      B.vial(ctx, t, VIAL[0], VIAL[1], VIAL[2], { cross: span(t, a.didnt + .5, a.didnt + 1.3) });
      maskLine(ctx, [['A4 (SOLANEZUMAB)', 0]], VIAL[0], VIAL[1] - VIAL[2] - 40, 28, rise(span(t, a.oneSuch + .5, a.oneSuch + 1.3)), { serif: false, weight: 600, col: P.cream, glow: false, align: 'center' });
      maskLine(ctx, [['FAILED', 0]], VIAL[0], VIAL[1] + 56, 30, rise(span(t, a.didnt + .8, a.didnt + 1.5)), { serif: false, weight: 600, col: P.cream, glow: false, align: 'center' });
      ctx.restore();
    }
    ctx.restore();
  }
  // 5.05 the essay on the lectern opens, the magnifier · 5.06 the frame unfolds into C1 · 5.09 it folds back
  const essayOpen = (t) => span(t, a.sick + 1.0, a.sick + 2.4) * (1 - span(t, a.line + 1.0, a.line + 2.4));
  const lensU = (t) => span(t, a.existing - .3, a.existing + .5) * (1 - span(t, a.line + .2, a.line + 1.0));
  const unfold = (t) => sineIO(span(t, a.line + 1.1, a.line + 2.8)) * (1 - sineIO(span(t, a.race + .1, a.race + 1.7)));
  let TB = null;
  function wall(ctx, t) {
    const f = unfold(t);
    if (f > 0) {
      const bw = TEXT.w, bh = (TB ? TB.bottom : 690) - (TEXT.y - TEXT.size), cx0 = TEXT.x + bw / 2, cy0 = TEXT.y - TEXT.size + bh / 2, k = lerp(Math.min(FR.w / bw, FR.h / bh) * .8, 1, f);
      ctx.save(); ctx.translate(lerp(FR.x + FR.w / 2, cx0, f), lerp(FR.y + FR.h / 2, cy0, f)); ctx.scale(k, k); ctx.translate(-cx0, -cy0); ctx.globalAlpha *= span(f, .25, .7);
      const r = F.wallText(ctx, t, T, { id: 'C1', x: TEXT.x, y: TEXT.y, w: TEXT.w, size: TEXT.size, read: false, credit: 1, hi: [["Alzheimer's", a.mention - .2]] });
      if (r && !TB) TB = r;
      ctx.restore();
    }
    // 5.09 the date of the pitch lights · 6.01 through the frame: the stage
    const du = smooth(span(t, a.date - .1, a.date + .6)) * (1 - span(t, a.venki, a.venki + 1));
    if (du > 0) { ctx.save(); ctx.globalAlpha *= du; F.mintText(ctx, [['NOV 10, 2026', 1]], FR.x + FR.w, FR.y - 22, 24, 1, { serif: false, weight: 600, align: 'right' }); halo(ctx, FR.x + FR.w + 80, FR.y - 30, 120, .25 * du, MINT.halo, MINT.core); ctx.restore(); }
    const sa = span(t, a.partly + .4, a.partly + 1.8) * (1 - span(t, a.villain + 2.6, a.villain + 3.6));
    if (sa > 0) { ctx.save(); ctx.beginPath(); ctx.roundRect(FR.x, FR.y, FR.w, FR.h, 10); ctx.clip(); ctx.translate(FR.x, FR.y); B.stage(ctx, t, FR.w, FR.h, { a: sa, spot: span(t, a.partly + 1.2, a.promise + .6) * (1 - .35 * smooth(span(t, a.villain, a.villain + 1.2))) }); ctx.restore(); }
  }
  // 5.08 the blood tube (the trace flies into it)
  const TUBE = [800, 770, 380];
  const tubeOut = (t) => sineIO(span(t, a.why + .05, a.why + 1.0));
  function raceExplainer(ctx, t, c) {
    if (t < a.race || t > a.why + 1.1) return;
    const out = tubeOut(t), [px, py] = (proj(c, ...L4(...TRACE)) || [500, 500]), pm = sineIO(span(t, a.race + .1, a.race + 1.1)) * (1 - out);
    ctx.save(); float(ctx, t, pm); panelBox(ctx, lerpR({ x: px - 6, y: py - 4, w: 12, h: 8 }, { x: 600, y: 300, w: 1150, h: 530 }, pm), span(pm, 0, .15)); ctx.globalAlpha = span(pm, .7, 1);
    const fly = span(t, a.race + .3, a.race + 1.8);
    const tu = rise(span(t, a.race + .9, a.race + 1.9)), gl = smooth(span(t, a.btest + .3, a.btest + 1.1));
    if (tu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(TUBE[0] - 160, TUBE[1] - 420 * expoOut(tu), 320, 440); ctx.clip(); F.bloodTube(ctx, t, TUBE[0], TUBE[1], TUBE[2], { fill: lerp(.15, .72, smooth(span(t, a.race + 1.6, a.btest + .6))), glow: gl }); ctx.restore(); }
    if (fly > 0 && fly < 1) { const v = sineIO(fly), x = lerp(px, TUBE[0], v), y = lerp(py, TUBE[1] - TUBE[2] * .3, v) - 120 * Math.sin(Math.PI * v); halo(ctx, x, y, 40, .6, MINT.halo, MINT.core); ctx.fillStyle = MINT.core; ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill(); }
    const x0 = 980;
    maskLine(ctx, [["FIRST ALZHEIMER'S", 0]], x0, 470, 46, rise(span(t, a.btest + .2, a.btest + 1)), { serif: false, weight: 600, col: P.cream, glow: false });
    F.mintText(ctx, [['BLOOD TEST CLEARED', .7]], x0, 528, 46, rise(span(t, a.btest + .4, a.btest + 1.2)), { serif: false, weight: 600 });
    maskLine(ctx, [['FDA, MAY 2025', 0]], x0, 574, 24, rise(span(t, a.btest + .7, a.btest + 1.4)), { serif: false, weight: 600, col: P.halo2, glow: false });
    F.bracket(ctx, x0, x0 + 560, 680, span(t, a.firstTr + .1, a.firstTr + 1.0), 'FOR PEOPLE WITH SYMPTOMS, 55+', { size: 24 });
    ctx.restore();
  }

  // ================================================================== c08 · C5 → THE PIPELINE → THE LABEL
  const plateIn = (t) => span(t, a.named + .1, a.C5.start + .25), plateOut = (t) => span(t, a.C5.end - .1, a.C5.end + 1.0);
  const pipeU = (t) => span(t, a.C5.end + .2, a.C5.end + 1.2), pipeDown = (t) => sineIO(span(t, a.other + .1, a.other + 1.3)), pipeGone = (t) => span(t, a.topol, a.topol + 1.0);
  function c5(ctx, t, c) {
    if (t < a.named || t > a.C5.end + 1.05) return;
    const p = proj(c, SP.x, SP.y), into = plateOut(t);
    const from = into > 0 ? { x: PIPE.x, y: PIPE.y - PIPE.h / 2, w: PIPE.w, h: PIPE.h } : [p[0], p[1], SP.r * p[2]];
    ctx.save(); float(ctx, t, .7 * smooth(plateIn(t)));
    B.audioPlate(ctx, t, T, { from, morph: into > 0 ? 1 - into : plateIn(t), wave: 1, edge: 1 - span(into, .7, 1) });
    ctx.restore();
  }
  function pipeAndLabel(ctx, t) {
    const pu = pipeU(t); if (pu <= 0 || t > a.end) return;
    const dn = pipeDown(t), gone = pipeGone(t);
    if (gone < 1) {
      const P0 = { x: lerp(PIPE.x, PIPE_LOW.x, dn), y: lerp(PIPE.y, PIPE_LOW.y, dn), w: lerp(PIPE.w, PIPE_LOW.w, dn), h: lerp(PIPE.h, PIPE_LOW.h, dn) };
      ctx.save(); ctx.globalAlpha = (1 - .45 * dn) * (1 - gone);
      F.pipeline(ctx, t, { ...P0, neck: .62, flow: 1, jam: .3 + .2 * span(t, a.testing, a.finding), labels: 0, u: pu });
      const nx = P0.x + P0.w * .62, lu = (1 - dn);
      halo(ctx, nx, P0.y, P0.h * 1.3, (.18 + .06 * Math.sin(t * 1.4)) * span(t, a.testing - .2, a.testing + .6), MINT.halo, MINT.core);
      maskLine(ctx, [['TESTING', 0]], nx, P0.y - P0.h * .1 - 66, 30, rise(span(t, a.testing - .1, a.testing + .6)) * lu, { serif: false, weight: 600, align: 'center', col: MINT.text, glow: false });
      maskLine(ctx, [['FINDING', 0]], P0.x + (nx - P0.x) * .4, P0.y - P0.h / 2 - 30, 30, rise(span(t, a.finding - .1, a.finding + .6)) * lu, { serif: false, weight: 600, align: 'center', col: COOL.text, glow: false });
      if (lu > 0) { ctx.strokeStyle = rgba(MINT.line, .6 * lu * span(t, a.testing, a.testing + .5)); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(nx, P0.y - P0.h * .1 - 56); ctx.lineTo(nx, P0.y - P0.h * .1 - 20); ctx.stroke(); }
      ctx.restore();
    }
    labelC8C9(ctx, t);
  }
  // THE LABEL (6.05 → 6.10): rises from the pipeline's neck; then steps to the lower left for c09; at the end it goes into the kiosk screen
  const lblRise = (t) => expoOut(span(t, a.other + .2, a.other + 1.4)), lblStep = (t) => sineIO(span(t, a.topol + .05, a.topol + 1.3));
  const lblHome = (t) => sineIO(span(t, a.away + .25, tPlate - .05));
  let camNow = null;
  function labelC8C9(ctx, t) {
    const r0 = lblRise(t); if (r0 <= 0) return;
    const st = lblStep(t), hm = lblHome(t);
    const nx = PIPE.x + PIPE.w * .62;
    let x = lerp(nx - 280, LBL.x, r0), y = lerp(PIPE.y, LBL.y, r0), s = lerp(.15, LBL.s, r0);
    x = lerp(x, LBL_C9.x, st); y = lerp(y, LBL_C9.y, st); s = lerp(s, LBL_C9.s, st);
    if (hm > 0 && camNow) { const p = proj(camNow, KS.x + KS.w / 2, KS.y + KS.h / 2); if (p) { const sk = KS.w * p[2] / F.DATES.w * .5; x = lerp(x, p[0] - F.DATES.w * sk / 2, hm); y = lerp(y, p[1] - F.DATES.h * sk / 2, hm); s = lerp(s, sk, hm); } }
    ctx.save(); float(ctx, t, (1 - hm) * .8); ctx.globalAlpha = span(r0, 0, .25) * (1 - span(hm, .75, 1));
    const fastP = bump(t, a.fast - .1, 1.0), yearsP = smooth(span(t, a.second, a.away + .4));
    const o = { found: 1, blink: 1, wait: lerp(.06, .18, smooth(span(t, a.away - .3, a.away + 1))) + .02 * Math.sin(t * .6), waitTag: '' };
    // 6.08 the general FOUND lifts off (a new medicine starts empty), then the mouse result stamps it again
    o.found = Math.max(1 - span(t, a.company + .2, a.company + .9), span(t, a.mice - .1, a.mice + .6));
    const r = F.twoDates(ctx, t, x, y, s, { ...o, glow: 1 });
    if (r && fastP > 0) halo(ctx, r.found[0], r.found[1], 140 * s, .35 * fastP, MINT.halo, MINT.core);
    if (r && yearsP > 0) halo(ctx, r.proven[0], r.proven[1], 120 * s, .12 * yearsP * (1 - hm), COOL.halo, COOL.body);
    // 6.05 an arrow from PROVEN forward, with a ?; the quote under the label (it leaves when the label steps aside)
    const au = span(t, a.betting + .1, a.betting + 1.1) * (1 - span(t, a.topol, a.topol + .6));
    if (r && au > 0) {
      const sl = r.slot, x1 = sl.x + sl.w * .92, x0 = sl.x + sl.w * .08;
      B.arrow(ctx, x1, sl.r2, x0, sl.r2, au, { lift: 46 * s, w: 3 * s, head: 16 * s });
      F.mintText(ctx, [['?', 1]], sl.x - 34 * s, sl.r2 + 20 * s, 56 * s, rise(span(t, a.speed - .2, a.speed + .5)) * (1 - span(t, a.topol, a.topol + .6)), { align: 'center' });
    }
    ctx.restore();
    const qu = rise(span(t, a.other + 1.2, a.other + 2.0)) * (1 - expoIn(span(t, a.topol - .1, a.topol + .5)));
    if (qu > 0) { ctx.save(); float(ctx, t, 1); F.mintText(ctx, [['“…much faster than we’re used to…”', 0]], LBL.x, LBL.y + 400, 44, qu);
      maskLine(ctx, [['AMODEI, FEB 2026', 0]], LBL.x, LBL.y + 446, 20, rise(span(t, a.other + 1.6, a.other + 2.3)) * (1 - expoIn(span(t, a.topol - .1, a.topol + .5))), { serif: false, weight: 600, col: P.halo2, glow: false }); ctx.restore(); }
  }
  const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

  // ================================================================== c09 · THE CARDS · THE MOUSE · THE QUEUE
  const CARD1 = { x: 560, y: 196, w: 820 }, CARD2 = { x: 980, y: 512, w: 860 };
  const PATH = [[560, 610], [1300, 610]], MOUSE = [1500, 660, 260];
  const cardsUp = (t) => sineIO(span(t, a.company - .1, a.company + 1.1));
  function c9(ctx, t) {
    if (t < a.topol + .4 || t > a.end) return;
    ctx.save(); float(ctx, t, 1 - span(t, a.same, a.same + 2));
    const up = cardsUp(t);
    if (up < 1) {
      const k = 1 - up, sx = (r) => lerp(PATH[0][0], r.x, k), sy = (r) => lerp(PATH[0][1], r.y, k);
      ctx.save(); ctx.globalAlpha *= 1 - span(up, .6, 1);
      const c2 = span(t, a.amodei - .3, a.amodei + 1.0);
      if (c2 > 0) { ctx.save(); const cx = lerp(CARD1.x, sx(CARD2), sineIO(c2)), cy = lerp(CARD1.y, sy(CARD2), sineIO(c2)); ctx.translate(cx, cy); ctx.scale(k, k);
        B.wallCard(ctx, t, 0, 0, CARD2.w, { u: c2, size: 58, lines: [[['“The thing that will work', 0]], [['is ', 0], ['actually curing cancer.', 1], ['”', 0]]], credit: 'AMODEI ON X, AUG 2026', hi: smooth(span(t, a.curing - .1, a.curing + .8)) }); ctx.restore(); }
      ctx.save(); ctx.translate(sx(CARD1), sy(CARD1)); ctx.scale(k, k);
      B.wallCard(ctx, t, 0, 0, CARD1.w, { u: span(t, a.eric - .2, a.eric + 1.1), size: 58, lines: [[['“…these cure projections', 0]], [['are wildly off-base…”', 0]]], credit: 'ERIC TOPOL, CARDIOLOGIST, ON X, AUG 2026', dim: span(t, a.fair, a.fair + 1) });
      ctx.restore(); ctx.restore();
    }
    // 6.08 a molecule runs a short bright path to a mouse · 6.09 it joins the queue before HUMAN TRIALS
    const pu = span(t, a.idea - .2, a.mice + .2), qj = sineIO(span(t, a.its + .1, a.its + 1.6)), roll = sineIO(span(t, a.same + .2, a.away + .6));
    ctx.save(); ctx.globalAlpha *= 1 - span(roll, .55, 1); ctx.translate(roll * 700, 0);
    const pa = span(t, a.company + .6, a.company + 1.4) * (1 - span(qj, 0, .6));
    if (pa > 0) {
      ctx.save(); ctx.globalAlpha *= pa;
      ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...PATH[0]); ctx.lineTo(...PATH[1]); ctx.stroke();
      if (pu > 0) F.mintTrail(ctx, PATH, expoOut(pu), { w: 4 });
      maskLine(ctx, [['MUSCULAR DYSTROPHY', 0]], PATH[0][0], 540, 44, rise(span(t, a.muscular - .1, a.muscular + .7)), { serif: false, weight: 600, col: P.cream, glow: false });
      maskLine(ctx, [['IDEA → MOUSE DATA IN < 18 MONTHS', 0]], PATH[0][0], 690, 32, rise(span(t, a.months - .3, a.months + .5)), { serif: false, weight: 600, col: MINT.text, glow: false });
      B.mouse(ctx, t, MOUSE[0], MOUSE[1], MOUSE[2], { a: rise(span(t, a.idea, a.idea + .8)), glow: .4 + .6 * span(t, a.mice - .2, a.mice + .5) });
      ctx.restore();
    }
    // the molecule: born from the mint words of the card, runs the path, then rolls back to the end of the queue
    const born = span(t, a.company + .3, a.company + 1.2);
    const QY = 650, QX0 = 660, QP = 52, NQ = 13, door = [1560, 760, 330];
    let mx = lerp(1500, PATH[0][0], sineIO(born)), my = lerp(420, PATH[0][1], sineIO(born));
    if (pu > 0) { const v = expoOut(pu); mx = lerp(PATH[0][0], PATH[1][0] + 40, v); my = PATH[0][1] - 6 * Math.sin(Math.PI * v); }
    if (qj > 0) { mx = lerp(mx, QX0, qj); my = lerp(my, QY, qj) - 80 * Math.sin(Math.PI * qj); }
    if (born > 0) F.molecule(ctx, t, mx, my, 76, 11, { col: MINT, a: rise(born) });
    if (pu > 0 && pu < 1) F.spark(ctx, t, mx + 30, my, 3, { a: 1, dir: [-60, 0] });
    if (qj > 0) {
      for (let k = 1; k <= NQ; k++) { const e = expoOut(span(t, a.its + .2 + k * .06, a.its + .8 + k * .06)); if (e <= 0) continue; const x = lerp(-80, QX0 + k * QP, e);
        F.molecule(ctx, t, x, QY + 4 * Math.sin(t * 1.3 + k), 52, 20 + k * 3, { col: COOL, a: .9 * e }); }
      B.trialDoor(ctx, t, door[0], door[1], door[2], { u: span(t, a.its + .4, a.its + 1.4) });
      maskLine(ctx, [['HUMAN TRIALS', 0]], door[0], door[1] - door[2] - 26, 28, rise(span(t, a.its + .8, a.its + 1.6)), { serif: false, weight: 600, col: P.cream, glow: false, align: 'center' });
      F.mintText(ctx, [['AS SOON AS LATE 2028', 0]], door[0], door[1] + 50, 26, rise(span(t, a.late - .1, a.late + .6)), { serif: false, weight: 600, align: 'center' });
    }
    ctx.restore();
    ctx.restore();
  }

  // ================================================================== veil (the hall dims while the explainers speak)
  const veilA = (t) => .5 * smooth(span(t, a.even + .4, a.even + 2.0)) * (1 - smooth(span(t, a.fourth + .2, a.fourth + 1.6)))
    + .55 * smooth(span(t, a.soMed + .2, a.soMed + 1.4)) * (1 - smooth(span(t, a.sick, a.sick + 1.3)))
    + .55 * smooth(span(t, a.race + .1, a.race + 1.2)) * (1 - smooth(span(t, a.why + .1, a.why + 1.3)))
    + .36 * smooth(span(t, a.named - .4, a.named + 1.2)) * (1 - smooth(span(t, a.C5.end + .5, a.C5.end + 1.5)))
    + .26 * smooth(span(t, a.C5.end + .5, a.C5.end + 1.5)) * (1 - smooth(span(t, a.same + .1, a.same + 2.0)));

  // ================================================================== one frame
  return (ctx, t) => {
    if (t < tIn) { S.plateMind(ctx, t, T); return; }
    if (t >= tPlate) { S.plateKiosk(ctx, t, T); return; }
    const c = cam(t); camNow = c;
    const v4g = lerp(.35, .82, smooth(span(t, a.even, a.even + 2)));
    S.hallWorld(ctx, c, t, {
      moon: lerp(.6, .75, smooth(span(t, a.even, a.even + 3))), du: false,
      v: (i) => (i === 2 ? { inside: (cx, w, h) => mindInside(cx, t, w, h) } : i === 3 ? { glow: v4g, inside: (cx, w, h) => brainInside(cx, t, w, h) } : {}),
      frame: { u: 1, cap: 1, a: 1 - smooth(span(unfold(t), .05, .5)) },
      lectern: { lamp: 1, open: essayOpen(t), lens: { x: .1, y: .02, r: .2, u: lensU(t), text: ['…may be very', 'difficult', 'to reverse.'], read: span(t, a.existing, a.existing + .8) } },
      kiosk: { glow: .5 }, post: { lit: lerp(.3, 1, smooth(span(t, a.venki, a.venki + 1.2))) * (1 - .7 * smooth(span(t, a.C5.end, a.same + 1.5))) + .3 * smooth(span(t, a.C5.end, a.same + 1.5)) },
      panel: (cx) => wall(cx, t),
    });
    veil(ctx, veilA(t));
    mindExplainers(ctx, t, c);
    alzExplainers(ctx, t, c);
    raceExplainer(ctx, t, c);
    c5(ctx, t, c);
    pipeAndLabel(ctx, t);
    c9(ctx, t);
    F.board(ctx, t, T);
    // sources (left, above the subtitles)
    F.source(ctx, t, a.half + .5, a.noblood + .3, F.SOURCES.turner);
    F.source(ctx, t, a.most, a.soMind + .8, F.SOURCES.essay);
    F.source(ctx, t, a.twenty + .2, a.means + 1.2, F.SOURCES.alzAssoc);
    F.source(ctx, t, a.oneSuch + .8, a.sick + .4, 'A4 STUDY (SOLANEZUMAB) · NEJM 2023');
    F.source(ctx, t, a.existing, a.line + .6, F.SOURCES.essay);
    F.source(ctx, t, a.other + 1.6, a.topol, 'DWARKESH PODCAST, FEB 2026');
    F.source(ctx, t, a.months, a.same + .6, F.SOURCES.mithril);
  };
}
