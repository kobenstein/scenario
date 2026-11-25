// c02 · B1 · 'In May, in Rome' → 'That promise is not a slogan' · shots 1.01–1.14 (docs/shots.md). One entry, one draw function, every
// motif scheduled on the voice; each motif hands over to the next through a carrier (column "carrier"), never a fade or a cut.
//
// | ID   | anchor (phrase)          | motif                                                                                  | type | carrier → next       |
// |------|--------------------------|----------------------------------------------------------------------------------------|------|----------------------|
// | 1.01 | In May, in Rome          | plateDisarmed: DISARMED shrinks into one gold line of a letter that unrolls behind it: MAGNIFICA HUMANITAS · ENCYCLICAL LETTER · 15 MAY 2026 · ROME pin · 245 PARAGRAPHS | EXPL | 245 |
// | 1.02 | His first                | 245 rolls over into a gold 1: HIS FIRST ENCYCLICAL                                     | EXPL | the letter           |
// | 1.03 | He even chose            | the letter steps left, LEO writes itself in gold; card: ADDRESS TO THE CARDINALS, 10 MAY 2025 (AI words light) | EXPL | the name |
// | 1.04 | You might expect         | LEO flies to the Pope's name tag; the Pope (left) and the block (right) slide in: a fight poster, VS lands on "against" | MIX | VS |
// | 1.05 | He is not                | VS splits, four symbols open out of the gap: HEAL · CONNECT · EDUCATE · PROTECT · §9    | EXPL | the symbols          |
// | 1.06 | What he refuses          | the four step back, one gold point: ONE IDEA                                           | EXPL | the point            |
// | 1.07 | His phrase for it        | the §117 card grows out of the point, words light as spoken                            | EXPL | “salvation.”         |
// | 1.08 | The title of this film   | “salvation.” lifts out, rolls into SAVE: AI WON'T SAVE YOU · OUR SHORT VERSION          | EXPL | the title line       |
// | 1.09 | Search the whole letter  | the title sinks into a search field; the whole letter scrolls under a scan line, word counter ≈ 38,000 | EXPL | the field |
// | 1.10–12 | No company …          | results: OPENAI … 0 · ALTMAN … 0 · SUPERINTELLIGENCE 0 · AGI 0                           | EXPL | the field            |
// | 1.13 | Then what is he arguing  | the field opens into the question card                                                 | EXPL | the card             |
// | 1.14 | A promise                | the card flips: A PROMISE; the machine block rises behind it                            | MIX  | the card → c03 banner |
import * as F from '../lib/f63_kit.mjs';
import * as S from '../lib/f63_seams.mjs';
import * as B from '../lib/f63_b1_kit.mjs';
import { createCanvas } from '@napi-rs/canvas';
const Q117 = '“…an outlook that devalues human limits and promises a purely technical form of “salvation.”';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER } = F;
export const PRINT = F.PRINT63;

// shared with c03: the promise card in front of the rising block (the inner seam c02 → c03 draws this same function)
export function anchorsPromise(T) { const arg = T.G('Then what is he arguing'); return { arguing: arg, promise: T.G('A promise', 0, arg) }; }
export const BLK = { x: W / 2, w: 400, h: 860 };
export const blockY = (t, A) => lerp(1980, 1020, sineIO(span(t, A.promise - .55, A.promise + 1.4)));   // rises in from below the frame
export function drawPromiseStage(ctx, t, A, o = {}) {
  const by = blockY(t, A);
  F.night(ctx, t, { glow: [W / 2, 470, 900, S.breathe(t, .8) + .5 * span(t, A.promise - .2, A.promise + 1.2)] });
  if (by < 1975) F.block(ctx, t, BLK.x, by, BLK.w, BLK.h, { lit: clamp((1975 - by) / 300), seed: 3, rays: .9 * clamp((1975 - by) / 300) });
  if (o.card !== false) B.promiseCard(ctx, t, { flip: sineIO(span(t, A.promise - .3, A.promise + .25)), q: 'WHAT IS HE ARGUING WITH?', qts: o.qts, pu: 1, ...(o.card || {}) });
}

export default async (T, R) => {
  const G = (p, after = R.a - .5) => T.G(p, 0, after);
  const a = { start: R.a, end: R.b };
  a.may = G('In May'); a.rome = G('Rome'); a.letter = G('a letter called'); a.ency = G('encyclical'); a.first = G('His first'); a.firstE = T.GE('His first', 0, R.a);
  a.chose = G('He even chose'); a.name = G('own name'); a.leo = G('Leo with'); a.ai = G('artificial intelligence in mind');
  a.expect = G('You might expect'); a.man = G('a man against'); a.against = G('against the machines'); a.machines = G('machines', a.against);
  a.not = G('He is not'); a.refuses = G('What he refuses'); a.idea = G('one idea'); a.phrase = G('His phrase for it'); a.purely = G('a purely technical'); a.salv = G('salvation', a.phrase);
  a.title = G('The title of this film'); a.short = G('short version'); a.search = G('Search the whole letter'); a.forty = G('forty thousand'); a.words = G('words', a.forty);
  a.company = G('No company'); a.ceo = G('No chief executive'); a.once = G('Not once the word'); a.superI = G('superintelligence', a.once);
  Object.assign(a, anchorsPromise(T));
  a.qts = F.wordTimes(T, 'what is he arguing with', null, a.arguing - .2);
  return [{ t: R.a, draw: scene(a, T), print: PRINT }];
};

// ---------------------------------------------------------------- layout
const LET = { x: 720, y: 116, w: 600, h: 770 };              // the letter (top centre)
const LINE_Y = 590;                                            // the DISARMED line inside the letter
const RX = 1150;                                               // the right column of labels
const SYM = ['heal', 'connect', 'educate', 'protect'], SYM_L = ['HEAL', 'CONNECT', 'EDUCATE', 'PROTECT'];
const GY = 900, POPE = { x: 560, h: 560 }, BL = { x: 1380, w: 330, h: 640 };
const TT = { y: 540, size: 190, cond: .74 };                   // the title
const COL = { x0: 360, x1: 1000, y0: 236 }, PANEL = { x0: 1110, x1: 1740 };
const FIELD = { x: 960, y: 150, w: 1200, h: 92 };

function scene(a, T) {
  const t0 = S.seamT(T, 'disarmed');
  // ---------------------------------------------------------------- 1.01–1.03 · the letter
  const shrink0 = a.start + .45, shrink1 = a.rome + .55;          // DISARMED leaves the plate and becomes a line of the letter
  const roll0 = a.rome - .35, roll1 = a.letter + .55;             // the paper unrolls downward behind it
  const side0 = a.chose - .25, side1 = a.chose + .75;             // the letter steps left for LEO
  const letOut0 = a.expect - .3, letOut1 = a.expect + .6;         // the letter leaves left
  const disState = (t) => {                                       // [x, y, size, glow 0..1] of DISARMED (the glow goes when the paper reaches it)
    const u = sineIO(span(t, shrink0, shrink1)), pr = span(sineIO(span(t, roll0, roll1)), (LINE_Y - 40 - LET.y) / LET.h, (LINE_Y + 30 - LET.y) / LET.h);
    return [lerp(S.DIS.x, LET.x, u), lerp(S.DIS.y, LINE_Y, u), lerp(S.DIS.size, 46, u), 1 - .85 * pr];
  };
  const letterGroup = (ctx, t, fn) => {   // the letter's own transform (steps left, shrinks, leaves)
    const s = sineIO(span(t, side0, side1)), o = expoIn(span(t, letOut0, letOut1));
    const x = lerp(0, -380, s) - o * 900, k = lerp(1, .64, s);
    ctx.save(); ctx.translate(LET.x + x, LET.y + 60 * s); ctx.scale(k, k); ctx.translate(-LET.x, -LET.y); fn(); ctx.restore();
  };
  const drawLetter = (ctx, t) => {
    if (t > letOut1) return;
    const roll = sineIO(span(t, roll0, roll1));
    letterGroup(ctx, t, () => {
      B.letter(ctx, t, LET.x, LET.y, LET.w, LET.h, { roll, title: span(t, roll0 + .2, roll0 + .9), lines: span(t, roll0 + .3, roll1), given: span(t, a.letter, a.letter + .7), skip: [LINE_Y - 44, LINE_Y + 26] });
      if (t > shrink1) {   // the gold line inside the letter: DISARMED with its rule, §110 in the margin
        const [x, y, size, gl] = disState(t), tw = F.measure('DISARMED', size, true);
        F.glowText(ctx, 'DISARMED', x, y, { size, serif: true, align: 'center', col: mixHex(GOLD.text, GOLD.deep, 1 - gl), glow: false });
        if (gl > 0) F.glowText(ctx, 'DISARMED', x, y, { size, serif: true, align: 'center', col: GOLD.text, glow: true, a: gl });
        F.goldSpan(ctx, [[x - tw / 2, y + size * .2], [x + tw / 2, y + size * .2]], 0, 1, { w: 1.6, spark: false });
        F.capsLabel(ctx, '§110', LET.x - LET.w / 2 + 46, y - 4, span(t, roll1 - .2, roll1 + .4), { size: 22, col: GOLD.shade, align: 'left' });
      }
    });
  };
  const drawRightLabels = (ctx, t) => {
    const out = sineIO(span(t, side0 - .1, side0 + .5)); if (out >= 1) return;
    ctx.save(); ctx.translate(0, out * 30);
    const k = 1 - out;
    F.maskLine(ctx, [['15 May 2026', 0]], RX, 270, 66, rise(span(t, a.may + .35, a.may + 1.0)) * k, { serif: true, col: CREAM, glow: false });
    const pu = span(t, a.rome - .05, a.rome + .45) * k;   // the Rome pin drops in
    if (pu > 0) {
      const py = 330 - (1 - expoOut(pu)) * 60; ctx.save(); ctx.globalAlpha *= clamp(pu * 3);
      ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.arc(RX + 14, py, 14, Math.PI, 0); ctx.lineTo(RX + 14, py + 30); ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(RX + 14, py, 5, 0, B.TAU); ctx.fill(); F.halo(ctx, RX + 14, py + 30, 26, .6, GOLD.halo, GOLD.core); ctx.restore();
      F.capsLabel(ctx, 'ROME · VATICAN', RX + 46, 352, pu, { size: 28, col: GOLD.text, align: 'left' });
    }
    F.capsLabel(ctx, 'ENCYCLICAL: A LETTER FROM THE POPE', RX, 470, span(t, a.ency - .15, a.ency + .45) * k, { size: 26, col: CREAM, align: 'left' });
    // 245 PARAGRAPHS → rolls into 1 · HIS FIRST ENCYCLICAL
    const nu = rise(span(t, a.ency + .2, a.ency + .8)) * k, ru = span(t, a.first - .12, a.first + .38);
    if (nu > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(nu * 3);
      B.rollText(ctx, '245', '1', RX, 660, 190, ru, (s, x, y) => F.glowText(ctx, s, x, y + (1 - nu) * 120, { size: 190, serif: true, col: GOLD.text, glow: true }));
      B.rollText(ctx, 'PARAGRAPHS', 'HIS FIRST ENCYCLICAL', RX + 4, 716, 30, span(t, a.first, a.first + .45), (s, x, y) => F.glowText(ctx, s, x, y + (1 - nu) * 40, { size: 30, weight: 600, col: s === 'PARAGRAPHS' ? P.halo2 : GOLD.text, glow: false, spacing: .08 }));
      ctx.restore();
    }
    ctx.restore();
  };
  // LEO + the cardinals card
  const LEO = { x: 1130, y: 350, size: 250 };
  const leoState = (t) => {   // [x, y, size]: big over the right, then flies to the Pope's name tag
    const f = sineIO(span(t, a.expect - .1, a.expect + .9));
    return [lerp(LEO.x, popeX(t), f), lerp(LEO.y, GY - POPE.h - 70, f), lerp(LEO.size, 64, f)];
  };
  const drawLeo = (ctx, t) => {
    if (t < a.name - .3) return;
    const out = expoIn(span(t, a.refuses - .3, a.refuses + .4));
    F.capsLabel(ctx, 'HE CHOSE THE NAME', LEO.x, 128, span(t, a.name - .25, a.name + .35) * (1 - span(t, a.expect - .3, a.expect + .1)), { size: 26, col: CREAM });
    const [x, y, size] = leoState(t); const lw = F.measure('LEO', size, true);
    ctx.save(); ctx.translate(0, posterOut(t) * 900); void out;
    // LEO writes itself: three letters rise one by one on the spoken name
    const L = ['L', 'E', 'O']; let xx = x - lw / 2;
    for (let i = 0; i < 3; i++) { const u = span(t, a.leo - .12 + i * .1, a.leo + .35 + i * .1); F.maskLine(ctx, [[L[i], 1]], xx, y, size, rise(u), { serif: true, col: GOLD.text, glow: true }); xx += F.measure(L[i], size, true); }
    F.goldSpan(ctx, [[x - lw / 2, y + size * .16], [x + lw / 2, y + size * .16]], 0, smooth(span(t, a.leo + .2, a.leo + .9)), { w: lerp(2.6, 1.4, span(size, 250, 64)), spark: false });
    F.capsLabel(ctx, 'POPE LEO XIV', x, y + 52, span(t, a.man - .2, a.man + .4), { size: 26, col: GOLD.text });
    ctx.restore();
  };
  const drawCardinals = (ctx, t) => {
    const u = span(t, a.ai - .55, a.ai + .2), out = span(t, a.expect - .75, a.expect + .35); if (u <= 0 || out >= 1) return;
    const so = sineIO(out), sk = 1 - .35 * so;   // sinks and shrinks away (no lurch)
    ctx.save(); ctx.translate(1230, 560 + so * 760); ctx.scale(sk, sk); ctx.translate(-1230, -560);
    B.qcard(ctx, t, T, { text: '“…developments in the field of artificial intelligence that pose new challenges for the defence of human dignity, justice and labour.”', x: 640, y: 470, w: 1180, size: 40,
      head: 'ADDRESS TO THE CARDINALS · 10 MAY 2025', u, spoken: ['artificial intelligence'], after: a.chose });
    ctx.restore();
  };

  // ---------------------------------------------------------------- 1.04–1.06 · the poster, VS, the four symbols, one idea
  const poster0 = a.expect - .35;
  const popeX = (t) => lerp(-220, POPE.x, sineIO(span(t, poster0 - .2, poster0 + 1.2))) - lerp(0, 250, sineIO(span(t, a.not - .1, a.not + .9)));
  const blkX = (t) => lerp(2180, BL.x, sineIO(span(t, poster0 - .1, poster0 + 1.3))) + lerp(0, 250, sineIO(span(t, a.not - .1, a.not + .9)));
  const posterOut = (t) => expoIn(span(t, a.refuses - .2, a.refuses + .7));
  const SX = [660, 860, 1060, 1260], SY = 470;
  const drawPoster = (ctx, t) => {
    if (t < poster0) return;
    const po = posterOut(t), ly = lerp(1200, GY, expoOut(span(t, poster0, poster0 + .9))) + po * 400;
    if (po < 1) {
      ctx.save(); ctx.translate(0, po * 500);
      F.land(ctx, ly);
      const bx = blkX(t); F.block(ctx, t, bx, ly, BL.w, BL.h, { lit: 1, seed: 3, rays: .6 });
      const px = popeX(t), br = 1 + .006 * Math.sin(t * 2.1);
      const raise = .55 * expoOut(span(t, a.against - .4, a.against + .2)) * (1 - sineIO(span(t, a.not - .1, a.not + .6)));
      ctx.save(); ctx.translate(px, ly); ctx.scale(1, br); ctx.translate(-px, -ly); F.pope(ctx, px, ly, POPE.h, { raise, look: .2 + .05 * Math.sin(t * .5), light: 1, back: .5 }); ctx.restore();
      ctx.restore();
    }
    // VS lands on "against", splits on "He is not"
    const vu = span(t, a.against - .35, a.against + .1), sp = sineIO(span(t, a.not - .12, a.not + .5));
    if (vu > 0 && sp < 1) {
      const { f, sq } = B.landing(t, a.against - .35, .35), y = lerp(230, 560, f);
      for (const [ch, dx] of [['V', -1], ['S', 1]]) {
        ctx.save(); ctx.translate(960 + dx * (52 + sp * 420), y); ctx.scale(1 + .03 * sq, 1 - .06 * sq); ctx.globalAlpha *= 1 - sp;
        F.glowText(ctx, ch, 0, 0, { size: 230, serif: true, col: GOLD.text, align: 'center', glow: true }); ctx.restore();
      }
      if (sq > 0) F.halo(ctx, 960, 560, 160 * sq, .35 * sq, GOLD.halo, GOLD.core);
    }
    // the four symbols open out of the gap (cloning from the centre), labels, §9; then step back for ONE IDEA
    const so = sineIO(span(t, a.not - .05, a.not + .75)), back = sineIO(span(t, a.refuses - .1, a.refuses + .8)), gone = expoIn(span(t, a.idea - .1, a.idea + .7));
    if (so > 0 && gone < 1) for (let i = 0; i < 4; i++) {
      const x = lerp(960, SX[i], so) + (SX[i] - 960) * (back * .9 + gone * 2.2), s = 130 * lerp(1, .55, back);
      B.symbol(ctx, SYM[i], x, SY - 40 * back, s, span(t, a.not - .05 + i * .07, a.not + .45 + i * .07), { lit: 1 - back * .85, a: 1 - gone });
      F.capsLabel(ctx, SYM_L[i], x, SY + 118, span(t, a.not + .3 + i * .1, a.not + .8 + i * .1) * (1 - span(t, a.refuses - .2, a.refuses + .2)), { size: 26, col: GOLD.text });
    }
    const q9 = span(t, a.not + .5, a.not + 1.2), q9o = span(t, a.refuses - .15, a.refuses + .35);
    if (q9 > 0 && q9o < 1) {
      F.maskLine(ctx, [['“Technology has the power to heal, connect, educate and protect our common home …”', 0]], W / 2, 742, 44, rise(q9) * (1 - sineIO(q9o)), { glow: false, col: CREAM, align: 'center' });
      F.capsLabel(ctx, 'MAGNIFICA HUMANITAS · §9', W / 2, 796, q9 * (1 - q9o), { size: 24 });
    }
  };
  // ONE IDEA: the point
  const ptU = (t) => span(t, a.refuses + .1, a.idea + .25);
  const drawPoint = (ctx, t) => {
    const u = ptU(t), cardIn = span(t, a.phrase - .15, a.phrase + .35); if (u <= 0 || cardIn >= 1) return;
    const r = 16 * expoOut(u) * (1 + .08 * Math.sin(t * 3)) * (1 - cardIn);
    F.halo(ctx, 960, SY, 150 * expoOut(u) * (1 - cardIn * .7), .9, GOLD.halo, GOLD.core);
    ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(960, SY, r, 0, B.TAU); ctx.fill();
    const lo = span(t, a.phrase - .3, a.phrase + .1);
    F.capsLabel(ctx, 'WHAT HE REFUSES', 960, SY - 110, span(t, a.refuses, a.refuses + .5) * (1 - lo), { size: 26 });
    F.maskLine(ctx, [['ONE IDEA', 0]], 960, SY + 130, 58, rise(span(t, a.idea - .05, a.idea + .45)) * (1 - sineIO(lo)), { serif: true, col: CREAM, glow: false, align: 'center' });
  };

  // ---------------------------------------------------------------- 1.07–1.08 · §117, salvation → SAVE
  const CARD = { x: 290, y: 300, w: 1340, size: 58 };
  const cardOut0 = a.title - .15, cardOut1 = a.title + .7;
  let salvBox = null;
  { const c0 = createCanvas(8, 8).getContext('2d'); const c = B.qcard(c0, 0, null, { text: Q117, x: CARD.x, y: CARD.y, w: CARD.w, size: CARD.size, head: 'MAGNIFICA HUMANITAS · §117', u: 1 }); const b = c.boxes.find((q) => q.w.includes('salvation')); salvBox = { x: b.x, y: b.y, ww: b.ww }; }
  const drawCard117 = (ctx, t) => {
    const u = span(t, a.phrase - .15, a.phrase + .55); if (u <= 0 || t > cardOut1 + 1.05) return;
    const o = sineIO(span(t, cardOut0 - .3, cardOut1 + 1.05)), k = lerp(.04, 1, expoOut(u)) * (1 - .45 * o);   // sinks and shrinks away (no lurch)
    ctx.save(); ctx.translate(960, SY); ctx.scale(k, k); ctx.translate(-960, -SY); ctx.translate(0, o * 1600);
    B.qcard(ctx, t, T, { text: Q117, x: CARD.x, y: CARD.y, w: CARD.w, size: CARD.size,
      head: 'MAGNIFICA HUMANITAS · §117', u, spoken: ['a purely technical', 'salvation'], after: a.phrase, hide: (k2, wd) => wd.includes('salvation') && t > cardOut0 });
    ctx.restore();
  };
  // the title: AI WON'T [SAVE] YOU, centred; SAVE comes from “salvation.”
  const TW = F.titleWidth("AI WON'T SAVE YOU", TT.size, TT.cond), TX = W / 2 - TW / 2, SAVEX = TX + F.titleWidth("AI WON'T ", TT.size, TT.cond), SAVEW = F.titleWidth('SAVE', TT.size, TT.cond), YOUX = TX + F.titleWidth("AI WON'T SAVE ", TT.size, TT.cond);
  const ttlOut0 = a.search - .35, ttlOut1 = a.search + .3;
  const drawTitle = (ctx, t) => {
    if (t < cardOut0 || t > ttlOut1 + .05) return;
    const out = span(t, ttlOut0, ttlOut1);
    F.titleWords(ctx, [[{ w: 'AI', u: span(t, a.title + .75, a.title + 1.2) }, { w: "WON'T", u: span(t, a.title + .85, a.title + 1.3) }]], TX, TT.y, { size: TT.size, cond: TT.cond, out });
    F.titleWords(ctx, [[{ w: 'YOU', u: span(t, a.title + .95, a.title + 1.4) }]], YOUX, TT.y, { size: TT.size, cond: TT.cond, out });
    // “salvation.” flies from the card to SAVE's place and rolls over into SAVE (thumbnail type)
    const sb = salvBox;
    const f = sineIO(span(t, cardOut0, a.title + .55)), size = lerp(CARD.size, 92, f);
    const x = lerp(sb.x + sb.ww / 2, SAVEX + SAVEW / 2, f), y = lerp(sb.y, TT.y, f) - Math.sin(Math.PI * f) * 90;
    const ru = span(t, a.title + .5, a.title + .9);
    ctx.save(); ctx.translate(0, sineIO(out) * TT.size * .95);
    ctx.beginPath(); ctx.rect(-W, -H, W * 3, TT.y + TT.size * .14 + H); ctx.clip();
    B.rollText(ctx, 'salvation', 'SAVE', x, y, Math.max(size, TT.size * ru), ru, (s, xx, yy) => {
      if (s === 'SAVE') F.titleWords(ctx, [[{ w: 'SAVE', u: 1, col: GOLD.text }]], SAVEX, TT.y, { size: TT.size, cond: TT.cond });
      else F.glowText(ctx, '“salvation.”', xx, yy, { size, serif: true, col: GOLD.text, align: 'center', glow: true });
    });
    ctx.restore();
    F.capsLabel(ctx, 'THE TITLE OF THIS FILM: OUR SHORT VERSION', W / 2, TT.y + 92, span(t, a.short - .2, a.short + .4) * (1 - out), { size: 28, col: CREAM });
  };

  // ---------------------------------------------------------------- 1.09–1.13 · the full-text search
  const fieldIn = a.search + .05;
  const fieldRect = (t) => {   // the field grows out of the title line, glides up; then opens into the question card
    const g = expoOut(span(t, fieldIn, fieldIn + .6)), up = sineIO(span(t, fieldIn + .2, fieldIn + 1.1)), q = sineIO(span(t, a.arguing - .45, a.arguing + .35));
    let x = FIELD.x, y = lerp(TT.y - 110, FIELD.y, up), w = FIELD.w * lerp(.15, 1, g), h = FIELD.h, r = h / 2;
    x = lerp(x, B.PCARD.x, q); y = lerp(y, B.PCARD.y, q); w = lerp(w, B.PCARD.w, q); h = lerp(h, B.PCARD.h, q); r = lerp(r, 18, q);
    return { x, y, w, h, r, q };
  };
  const query = (t) => {
    if (t >= a.once - .05) { const n = Math.floor(clamp((t - a.superI + .2) / .55) * 17); return 'SUPERINTELLIGENCE'.slice(0, Math.max(0, n)); }
    if (t >= a.ceo - .1) return 'ALTMAN · MUSK · AMODEI · ZUCKERBERG';
    if (t >= a.company - .1) return 'OPENAI · GOOGLE · META · ANTHROPIC';
    return '';
  };
  const colIn = (t) => sineIO(span(t, a.search + .1, a.search + 1.2)), colOut = (t) => sineIO(span(t, a.arguing - 1.0, a.arguing + .5)) * 1.25;
  const sweeps = [a.search + .9, a.company - .05, a.ceo - .05, a.superI + .3];
  const drawColumn = (ctx, t) => {
    const ci = colIn(t), co = colOut(t); if (ci <= 0 || co >= 1) return;
    const y0 = COL.y0 + (1 - ci) * 900 + co * 900, x0 = COL.x0, w = COL.x1 - COL.x0;
    ctx.save();
    ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(x0 + 10, y0 + 14, w, H);
    ctx.fillStyle = lin(ctx, 0, y0, 0, H, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(x0, y0, w, H);
    ctx.beginPath(); ctx.rect(x0, y0, w, H); ctx.clip();
    const scroll = (t - a.search) * 260, lh = 13, top = y0 + 24 - (scroll % (lh * 40));
    B.greek(ctx, x0 + 30, top, w - 60, 120, lh, 5 + Math.floor(scroll / (lh * 40)), rgba(PAPER.ink, .42));
    // the scan line sweeps the column on every query
    for (const s0 of sweeps) { const su = span(t, s0, s0 + .75); if (su <= 0 || su >= 1) continue; const yy = y0 + sineIO(su) * (H - y0); ctx.fillStyle = lin(ctx, 0, yy - 60, 0, yy, [[0, rgba(GOLD.halo, 0)], [1, rgba(GOLD.halo, .35)]]); ctx.fillRect(x0, yy - 60, w, 60); ctx.fillStyle = GOLD.body; ctx.fillRect(x0, yy - 2, w, 3); }
    ctx.restore();
  };
  const lin = F.lin;
  const GROUPS = [['NO COMPANY', ['OPENAI', 'GOOGLE', 'META', 'ANTHROPIC'], () => a.company], ['NO CHIEF EXECUTIVE', ['ALTMAN', 'MUSK', 'AMODEI', 'ZUCKERBERG'], () => a.ceo]];
  const drawPanel = (ctx, t) => {
    const ci = colIn(t), co = colOut(t); if (ci <= 0 || co >= 1) return;
    // the word counter (the size of the letter)
    const cu = span(t, a.forty - .3, a.words + .3), cOut = sineIO(span(t, a.company - .35, a.company + .2));
    if (cu > 0 && cOut < 1) {
      const n = Math.round(lerp(0, 38000, sineIO(cu)) / 100) * 100;
      ctx.save(); ctx.translate(0, -cOut * 40); ctx.globalAlpha *= 1 - cOut;
      F.capsLabel(ctx, 'FULL-TEXT SEARCH', PANEL.x0, 330, span(t, a.search + .3, a.search + .9), { size: 26, align: 'left', col: CREAM });
      F.maskLine(ctx, [[`≈ ${n.toLocaleString('en-US')}`, 1]], PANEL.x0, 470, 120, rise(span(t, a.forty - .3, a.forty + .3)), { serif: true, col: GOLD.text, glow: true });
      F.capsLabel(ctx, 'WORDS, MAIN TEXT · 245 PARAGRAPHS', PANEL.x0, 528, span(t, a.words - .2, a.words + .4), { size: 26, align: 'left' });
      ctx.restore();
    }
    // two result groups, every count a gold 0
    const gOut = sineIO(span(t, a.once - .25, a.once + .3));
    GROUPS.forEach(([head, rows, at], gi) => {
      const g0 = at(), y0 = 300 + gi * 270; if (t < g0 - .2 || gOut >= 1) return;
      ctx.save(); ctx.translate(0, -gOut * 60 + co * 900); ctx.globalAlpha *= 1 - gOut;
      F.capsLabel(ctx, head, PANEL.x0, y0, span(t, g0 - .15, g0 + .3), { size: 26, align: 'left', col: GOLD.text });
      rows.forEach((r, i) => {
        const u = span(t, g0 + .05 + i * .08, g0 + .45 + i * .08), yy = y0 + 52 + i * 50;
        F.maskLine(ctx, [[r, 0]], PANEL.x0, yy, 30, rise(u), { serif: false, weight: 600, col: CREAM, glow: false });
        F.maskLine(ctx, [['0', 1]], PANEL.x1, yy + 4, 46, rise(span(u, .3, 1)), { serif: true, col: GOLD.text, glow: true, align: 'right' });
        ctx.fillStyle = rgba(P.blue1, .6 * u); ctx.fillRect(PANEL.x0, yy + 14, (PANEL.x1 - PANEL.x0) * expoOut(u), 1);
      });
      ctx.restore();
    });
    // SUPERINTELLIGENCE 0 · AGI 0
    const su = span(t, a.superI + .1, a.superI + .7);
    if (su > 0) {
      ctx.save(); ctx.translate(0, co * 900);
      F.maskLine(ctx, [['0', 1]], (PANEL.x0 + PANEL.x1) / 2, 560, 300, rise(su), { serif: true, col: GOLD.text, glow: true, align: 'center' });
      F.capsLabel(ctx, '“SUPERINTELLIGENCE”: 0 HITS', (PANEL.x0 + PANEL.x1) / 2, 640, span(t, a.superI + .4, a.superI + .9), { size: 28, col: CREAM });
      F.capsLabel(ctx, '“AGI”: 0 HITS', (PANEL.x0 + PANEL.x1) / 2, 690, span(t, a.superI + .7, a.superI + 1.2), { size: 28, col: CREAM });
      ctx.restore();
    }
  };
  const drawField = (ctx, t) => {
    if (t < fieldIn) return;
    const r = fieldRect(t);
    if (r.q < 1) {   // the pill → the card (colours and corner radius move with the shape)
      ctx.save();
      ctx.fillStyle = rgba(P.night0, .45 * r.q); ctx.beginPath(); ctx.roundRect(r.x - r.w / 2 + 10, r.y - r.h / 2 + 14, r.w, r.h, r.r); ctx.fill();
      ctx.fillStyle = mixHex(mixHex(P.night0, P.ind0, .6), mixHex(P.night1, P.ind2, .55), r.q); ctx.beginPath(); ctx.roundRect(r.x - r.w / 2, r.y - r.h / 2, r.w, r.h, r.r); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.line, lerp(.9, .75, r.q)); ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
      if (r.q === 0) B.searchField(ctx, t, r.x, r.y, r.w, r.h, query(t), { u: 1, size: 34 });
      else { const g = 1 - span(r.q, 0, .3); if (g > 0) { ctx.save(); ctx.globalAlpha *= g; B.searchField(ctx, t, r.x, r.y, r.w, r.h, '', { u: 1, caret: false }); ctx.restore(); } }
      if (r.q > .6) F.question(ctx, t, 'WHAT IS HE ARGUING WITH?', B.PCARD.x, B.PCARD.y + 34, 92, { ts: a.qts });
    } else drawPromiseStage(ctx, t, a, { qts: a.qts, bgDone: true });
  };

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t < a.start + .4) { S.plateDisarmed(ctx, t, T); return; }
    const fr = fieldRect(t);
    if (fr.q >= 1) { drawPromiseStage(ctx, t, a, { qts: a.qts }); return; }
    // the plate's ground stays (same glow), it moves with the motifs
    F.night(ctx, t, { glow: [W / 2, 470, 900, S.breathe(t, .8)] });
    if (t > a.promise - .6) { const by = blockY(t, a); if (by < 1975) F.block(ctx, t, BLK.x, by, BLK.w, BLK.h, { lit: clamp((1975 - by) / 300), seed: 3, rays: .9 * clamp((1975 - by) / 300) }); }
    // the plate's creep keeps running while DISARMED leaves it (no step at +0.4 s)
    const z = 1 + S.CREEP * (t - t0), kz = 1 - sineIO(span(t, shrink0, shrink1));
    F.look(ctx, W / 2, H / 2 - 20 * kz, lerp(1, z, kz), () => {
      drawLetter(ctx, t);
      if (t < shrink1) { const [x, y, size] = disState(t); S.disarmedWord(ctx, t, x, y, size, { rule: 1 }); }
    });
    drawRightLabels(ctx, t);
    drawCardinals(ctx, t);
    drawPoster(ctx, t);
    drawLeo(ctx, t);
    drawPoint(ctx, t);
    drawCard117(ctx, t);
    drawTitle(ctx, t);
    drawColumn(ctx, t);
    drawPanel(ctx, t);
    drawField(ctx, t);
    F.source(ctx, t, a.forty, a.once - .2, 'MAGNIFICA HUMANITAS (VATICAN.VA): 245 PARAGRAPHS, ABOUT 37,960 WORDS OF MAIN TEXT · OUR FULL-TEXT SEARCH');
  };
}
