// c08 · HARARI'S ANSWER (builder B2) · "Harari's own answer" → 'Three tests' (plateAnvil). One planned cut at the start (W 7.01, from
// the Leitbild back to the board): a MATCH CUT on the link in your hand — the same gold link at the same place, size and angle — which
// glides on and becomes the O of NO. After that one take on the board; the view carries right → left to left → right… always forward.
//
// | ID    | anchor (phrase)               | zeigt wörtlich                                                          | kind  | carrier out              |
// |-------|-------------------------------|-------------------------------------------------------------------------|-------|--------------------------|
// | 7.01  | Harari's own answer (W)       | HARARI'S ANSWER: NO (the O is the link from your hand)                  | EXPL  | the word                 |
// | 7.02  | Do not believe it             | INEVITABLE rises, a gold line strikes it through                        | EXPL  | the gold line            |
// | 7.03  | His advice, in his            | the line becomes the top edge of quote card Q3, words light as spoken   | EXPL  | the card folds to a line |
// | 7.04  | Elon Musk sees                | the line becomes a ride track; a car rolls in with a RISK tag · Musk    | MIX   | the car                  |
// | 7.05  | But progress looks            | the car rolls down, the rider lifts both arms: “LET'S ENJOY THE RIDE…”  | MIX   | a card flips up          |
// | 7.06  | The optimists hold            | a card flips up from the track: THE OPTIMISTS                           | EXPL  | the card turns           |
// | 7.07  | A machine that confuses       | the card turns round: a machine screen; it holds up a magnifier         | MIX   | the magnifier            |
// | 7.08  | Estonia, this year            | the magnifier reveals a law document · ESTONIA · ERR NEWS, JAN 2026     | EXPL  | one paragraph            |
// | 7.09  | A mistake in a new            | a gap opens in one line; a casino chip rolls through: UNTAXED           | EXPL  | the gap                  |
// | 7.10  | People caught it first        | small readers; one points, a cream mark rings the gap                   | MIX   | the marked document      |
// | 7.10b | Then a citizen handed         | the document is handed to two chat windows                              | MIX   | the windows              |
// | 7.11  | They found the contradictions | both windows mark the same line gold                                    | EXPL  | the gap                  |
// | 7.12  | Parliament fixed the law      | the gap closes: LAW CORRECTED, FEB 2026                                 | EXPL  | the gold line drops      |
// | 7.13★ | That is the cow               | the line drops into her hill; beside her someone reads her the line of trade: AN INTERPRETER | MIX | the type   |
// | 7.14  | It is the best argument       | THE BEST ARGUMENT · AND IT IS REAL                                      | EXPL  | a spotlight              |
// | 7.15  | Harari deserves the same      | a spotlight on a lectern, a silhouette behind it (no face)              | SCENE | three tags               |
// | 7.16  | He is a historian             | HISTORIAN · AUTHOR · PAID SPEAKER hang on the lectern; books glow       | MIX   | a suitcase               |
// | 7.17  | After his Prague appearance   | a suitcase opens: metaphors and ? fly out, the ANSWERS pocket is empty   | MIX   | two windows              |
// | 7.18  | In South Africa, a machine    | two chat windows; left: a source line dissolves (callback 5.10)         | EXPL  | the right window         |
// | 7.19  | In Estonia, a machine         | right: the magnifier marks the error gold (callback 7.11)               | EXPL  | the question             |
// | 7.20  | How do you tell               | WHICH ONE DESERVES YOUR TRUST?; the windows fold into the anvil → plateAnvil | EXPL | plateAnvil          |
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f70_kit.mjs';
import * as S from '../lib/f70_world.mjs';
import * as X from '../lib/f70_explain.mjs';
import * as B from '../lib/b2_kit.mjs';
import { leit07 } from './sc07.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, LAMP, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT70, TAU = Math.PI * 2;

export default async (T, R) => {
  const G = (p, after = R.a - .1) => T.G(p, 0, after);
  const A = {
    noW: T.GE("own answer is", 0, R.a - .1), inev: G('Do not believe it'), inevW: G('inevitable'), advice: G('His advice, in his'),
    musk: G('Elon Musk sees'), prog: G('But progress looks'), ride: G('enjoy the ride'), optim: G('The optimists hold'), conf: G('A machine that confuses'),
    explain: G('can also explain'), est: G('Estonia, this year'), mist: G('A mistake in a new'), casinos: G('online casinos'), untaxed: G('untaxed'),
    people: G('People caught it first'), citizen: G('Then a citizen handed'), found: G('They found the contradictions'), parl: G('Parliament fixed the law'),
    cow: G('That is the cow'), interp: G('an interpreter'), best: G('It is the best argument'), real: G('and it is real'), hard: G('Harari deserves the same'),
    hist: G('He is a historian'), books: G('books and lectures'), lect: G('lectures'), prague: G('After his Prague'), suit: G('a suitcase full'),
    meta: G('metaphors and good'), quest: G('good questions'), noans: G('but no answers'), sa2: G('In South Africa, a machine'),
    est2: G('In Estonia, a machine'), how: G('How do you tell'), T0: R.b,
  };
  const Q3 = T.clip('Q3'), tP = A.T0 - S.SEAM_HALF;
  // ---------------------------------------------------------------- the view (board units)
  const VK = [[R.a, { x: -8400, y: 540, s: 1 }], [A.musk - .25, { x: -8396, y: 541, s: 1.01 }], [A.musk + 1.6, { x: -6900, y: 540, s: 1 }],
    [A.est - .25, { x: -6896, y: 541, s: 1.01 }], [A.est + 1.5, { x: -5300, y: 540, s: 1 }], [A.citizen - .1, { x: -5297, y: 540, s: 1.01 }],
    [A.citizen + 1.6, { x: -4500, y: 540, s: 1 }], [A.cow - .4, { x: -4497, y: 541, s: 1.01 }], [A.cow + 2.0, { x: -3300, y: 900, s: 1 }],
    [A.best - .1, { x: -3300, y: 896, s: 1.05 }], [A.hard - .35, { x: -3298, y: 895, s: 1.06 }], [A.hard + 1.6, { x: -500, y: 540, s: 1 }],
    [A.sa2 - .35, { x: -497, y: 541, s: 1.01 }], [A.sa2 + 1.5, { x: W / 2, y: H / 2, s: 1 }], [tP, { x: W / 2, y: H / 2, s: 1 }]];
  const view = (t) => X.viewPath(t, VK);

  // ---------------------------------------------------------------- 7.01–7.03: NO · INEVITABLE · Q3 (board = screen offset at S1)
  const S1 = -8400, bx = (sx) => S1 - W / 2 + sx;   // screen x at S1 → board x
  const L7 = leit07(T), first = (() => { const c = createCanvas(W, H); return S.chainWorld(c.getContext('2d'), R.a, L7.cam(R.a), L7.st(R.a)).first; })();
  const NS = 300, wN = F.measure('N', NS, true), OL = 220, OW = OL * .58, tot = wN + 28 + OW, xN = W / 2 - tot / 2, xO = xN + wN + 28 + OW / 2, yB = 610, yO = yB - NS * .34;
  const flyU = (t) => { const u = span(t, R.a, R.a + 1.4); return .55 * sineIO(u) + .45 * u; };   // leaves the cut already moving (no frozen frames)
  const noOut = (t) => span(t, A.advice - .15, A.advice + .45);
  const IV = { y: 800, size: 116 }, CARD = { x: 360, y: 300, w: 1200 };
  const strikeY = IV.y - IV.size * .3;
  function noBlock(ctx, t) {
    if (t > A.musk + 2) return;
    const o = noOut(t);
    X.label(ctx, "HARARI'S ANSWER", bx(W / 2), 330, B.lab(t, R.a + .3, A.advice + .2), { size: 36, spacing: .2 });
    B.gold(ctx, [['N', .15]], bx(xN), yB, NS, span(t, A.noW - .15, A.noW + .45) * (1 - o), { serif: true, glow: true });
    // the link: from your hand (match cut) into the O of NO; it sinks with the word
    const f = flyU(t), x = lerp(bx(first[0]), bx(xO), f), y = lerp(first[1], yO, f) - Math.sin(Math.PI * f) * 60, L = Math.exp(lerp(Math.log(first[3]), Math.log(OL), f));
    const ang = lerp(first[2], Math.PI / 2, f), sink = expoIn(o);
    if (sink < 1) { ctx.save(); if (o > 0) { ctx.beginPath(); ctx.rect(bx(0), 0, W, yB + 20); ctx.clip(); }
      F.chainLink(ctx, t, x, y + sink * NS * 1.1, L, ang, { lit: .25 + .35 * span(t, A.noW, A.noW + .4) + .1 * Math.sin(t * 2.2) }); ctx.restore(); }
    // INEVITABLE, struck through in gold
    const iu = B.lab(t, A.inevW - .15, A.advice + .35);
    B.big(ctx, 'INEVITABLE', bx(W / 2), IV.y, IV.size, iu, { gold: 0, glow: false, col: CREAM2 });
    const iw = F.measure('INEVITABLE', IV.size, true), sx0 = bx(W / 2 - iw / 2 - 20), sx1 = bx(W / 2 + iw / 2 + 20);
    // the strike → rises to the card's top edge → the card unfolds down from it → folds back up into the line → the track (7.04)
    const su = span(t, A.inevW + .5, A.inevW + 1.0), up = sineIO(span(t, A.advice - .05, A.advice + .8));
    if (su > 0 && t < A.musk + .2) {
      const y = lerp(strikeY, CARD.y, up), x0 = lerp(sx0, bx(CARD.x), up), x1 = lerp(sx1, bx(CARD.x + CARD.w), up);
      const open = sineIO(span(t, A.advice + .6, A.advice + 1.4)) * (1 - sineIO(span(t, A.musk - .45, A.musk + .15)));
      if (open > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(bx(0), y, W, 330 * open); ctx.clip();
        F.quoteCard(ctx, t, T, { text: SRC.q3.text, credit: SRC.q3.credit, spoken: SRC.q3.spoken, after: R.a, size: 70, w: CARD.w, x: bx(CARD.x), y: CARD.y, u: 1, rot: 0 });
        ctx.restore();
      }
      F.goldSpan(ctx, [[x0, y], [x1, y]], 0, su, { w: 3, spark: su < 1 });
    }
  }
  const CREAM2 = F.CREAM2;
  // ---------------------------------------------------------------- 7.04–7.07: the ride
  const TR = E.catmull([[-8300, 420], [-7600, 420], [-7420, 424], [-7290, 470], [-7150, 640], [-7000, 775], [-6860, 805], [-6720, 790], [-6580, 710],
    [-6430, 615], [-6260, 585], [-6060, 612], [-5820, 662], [-5500, 700]], 8);
  const TRL = F.pathLen(TR), dTop = F.pathLen(TR.slice(0, 1 + TR.findIndex((p) => p[0] >= -7420))), dVal = (() => { let best = 0, by = -1e9; for (let d = 0; d < TRL; d += 5) { const [, y] = F.pathAt(TR, d); if (y > by) { by = y; best = d; } } return best; })();
  const morphU = (t) => sineIO(span(t, A.musk - .05, A.musk + 1.55));
  const LINE0 = B.resample([[bx(CARD.x), CARD.y], [bx(CARD.x + CARD.w), CARD.y]], TR.length);
  function carD(t) {
    if (t < A.prog + .5) return lerp(0, dTop, expoOut(span(t, A.musk + .9, A.musk + 1.9)));
    const tau = t - (A.prog + .5), w = 2.0, z = .5; return dVal + (dTop - dVal) * Math.cos(w * tau) * Math.exp(-z * tau) + 6 * Math.sin(t * 1.3) * (1 - Math.exp(-z * tau));
  }
  const CD = { x: -6440, y: 612 };   // the optimists' card stands on the track here
  function ride(ctx, t) {
    if (t < A.musk - .2 || t > A.est + 2.2) return;
    const m = morphU(t);
    if (m < 1) { const pts = LINE0.map(([x, y], i) => [lerp(x, TR[i][0], m), lerp(y, TR[i][1], m)]); X.lightLine(ctx, pts, 1, { w: 3.5, col: mixHex(GOLD.body, CREAM, m), glowCol: GOLD.halo }); }
    else B.track(ctx, TR, 1);
    if (m > .9) { const su = span(m, .9, 1); ctx.save(); ctx.globalAlpha *= su; B.track(ctx, TR, 1); ctx.restore(); }
    // the car + rider + RISK tag
    const cu = span(t, A.musk + .9, A.musk + 1.2);
    if (cu > 0) {
      const d = carD(t), [x, y, a] = F.pathAt(TR, Math.max(1, d)), lift = sineIO(span(t, A.ride - .5, A.ride + .4));
      ctx.save(); ctx.translate(x, y - 6); ctx.rotate(a);
      ctx.save(); ctx.beginPath(); ctx.rect(-80, -200, 160, 166); ctx.clip();
      E.person(ctx, 0, 20, 90, { dir: 1, light: .8, rim: LAMP.body, armR: [lerp(1.2, 2.95, lift), lerp(1.4, 3.08, lift)], armL: [lerp(-.6, 2.85, lift), lerp(-.4, 3.0, lift)], look: .2 });
      ctx.restore();
      ctx.fillStyle = mixHex(P.night1, P.blue1, .55); ctx.beginPath(); ctx.roundRect(-62, -48, 124, 44, 12); ctx.fill();
      ctx.fillStyle = rgba(LAMP.body, .5); ctx.fillRect(-62, -48, 124, 2.5);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .4); for (const wx of [-36, 36]) { ctx.beginPath(); ctx.arc(wx, -4, 9, 0, TAU); ctx.fill(); }
      B.tag(ctx, 52, -30, 26, 'RISK', span(t, A.musk + 1.3, A.musk + 1.9), .12 * Math.sin(t * 2.1 + 1) - a * .8);
      ctx.restore();
    }
    // the quote
    const q = SRC.muskQuote, cut = q.indexOf(', ') + 1, l1 = q.slice(0, cut), l2 = q.slice(cut + 1);   // break after the comma (verbatim string)
    B.big(ctx, l1, -6900, 200, 50, B.lab(t, A.ride - .6, A.optim - .1), { gold: .3 });
    B.big(ctx, l2, -6900, 262, 50, B.lab(t, A.ride - .35, A.optim + 0), { gold: .3 });
    // 7.06 the card flips up from the track; 7.07 it turns round: the machine, which holds up a magnifier
    const fu = expoOut(span(t, A.optim + .05, A.optim + .8)), turn = sineIO(span(t, A.conf - .05, A.conf + .8));
    if (fu > 0 && t < A.est + 2.2) {
      const cw = 340, ch = 200, sx = Math.cos(Math.PI * turn), back = turn > .5;
      ctx.save(); ctx.translate(CD.x, CD.y); ctx.scale(Math.max(.02, Math.abs(sx)), fu);
      if (!back) {
        B.sheet(ctx, 0, -ch / 2, cw, ch);
        B.gold(ctx, [['THE OPTIMISTS', 0]], 0, -ch / 2 + 16, 50, span(t, A.optim + .5, A.optim + 1.0), { serif: true, align: 'center', col: PAPER.ink });
      } else {
        ctx.fillStyle = mixHex(P.night0, COOL.deep, .55); ctx.strokeStyle = rgba(COOL.line, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-cw / 2, -ch, cw, ch, 14); ctx.fill(); ctx.stroke();
        for (let k = 0; k < 3; k++) { ctx.strokeStyle = rgba(COOL.core, .35 + .2 * k); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, -ch / 2, 46 * (1 - k * .28) * (1 + .04 * Math.sin(t * 1.6 - k)), 0, TAU); ctx.stroke(); }
        ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(0, -ch / 2, 9, 0, TAU); ctx.fill();
        halo(ctx, 0, -ch / 2, cw * .7, .25, COOL.halo, COOL.core);
      }
      ctx.restore();
    }
    X.label(ctx, 'CAN ALSO EXPLAIN', CD.x, CD.y + 60, B.lab(t, A.explain - .1, A.est + .3), { size: 28, spacing: .14, col: COOL.text });
  }
  // the magnifier: rises from the machine (7.07), carries the eye to Estonia (7.08), hovers at the gap, then leaves up-right (7.10b)
  const DC = { x: -5300, y: 520, w: 440, h: 560 }, GAPI = 4, lineY = (i) => DC.y - DC.h / 2 + 110 + i * 44, GAPX = DC.x + 10;
  function magAt(t) {
    const r0 = [CD.x + 120, CD.y - 290], r1 = [GAPX + 40, lineY(GAPI) - 10];
    const up = expoOut(span(t, A.conf + .9, A.conf + 1.7)), go = sineIO(span(t, A.est - .2, A.est + 1.6)), away = sineIO(span(t, A.citizen + .1, A.citizen + 1.7));
    let x = lerp(CD.x + 20, r0[0], up), y = lerp(CD.y - 100, r0[1], up);
    x = lerp(x, r1[0], go) + 8 * Math.sin(t * .9); y = lerp(y, r1[1], go) - Math.sin(Math.PI * go) * 120 + 6 * Math.sin(t * 1.3);
    return [lerp(x, -4250, away), lerp(y, -160, away), up];
  }
  // ---------------------------------------------------------------- 7.08–7.12: Estonia
  const handU = (t) => sineIO(span(t, A.citizen + .2, A.citizen + 1.6));
  const docT = (t) => { const k = handU(t); return { x: lerp(DC.x, -4500, k), y: lerp(DC.y, 560, k), s: lerp(1, .62, k) }; };
  const gapW = (t) => 96 * expoOut(span(t, A.casinos - .4, A.casinos + .2)) * (1 - sineIO(span(t, A.parl + .2, A.parl + 1.0)));
  const WL = { x: -4920, y: 470 }, WR = { x: -4080, y: 470 }, WW = 330, WH = 290;
  function estonia(ctx, t, v) {
    if (t < A.conf || t > A.cow + 3) return;
    const [mx, my, mu] = magAt(t), d = docT(t);
    // the document, revealed by the lens (its left part first), then handed on
    const rev = t < A.est - .2 ? 0 : clamp((mx - (DC.x - DC.w / 2)) / DC.w * 1.3);
    if (rev > 0) {
      ctx.save();
      if (rev < 1 && handU(t) <= 0) { ctx.beginPath(); ctx.rect(DC.x - DC.w / 2 - 20, DC.y - DC.h / 2 - 20, (DC.w + 40) * rev, DC.h + 40); ctx.clip(); }
      ctx.translate(d.x, d.y); ctx.scale(d.s, d.s);
      B.sheet(ctx, 0, 0, DC.w, DC.h, { rot: -.006 });
      ctx.fillStyle = rgba(PAPER.ink, .75); ctx.fillRect(-DC.w / 2 + 44, -DC.h / 2 + 50, DC.w * .5, 12);
      const gw = gapW(t), fixed = span(t, A.parl + .2, A.parl + 1.0);
      for (let i = 0; i < 10; i++) {
        const y = lineY(i) - DC.y, x0 = -DC.w / 2 + 44, w = DC.w - 88 - (i % 4 === 3 ? 120 : 0);
        if (i !== GAPI) { ctx.fillStyle = rgba(PAPER.ink, .5); ctx.fillRect(x0, y, w, 6); continue; }
        const gx = GAPX - DC.x;
        ctx.fillStyle = mixHex(rgba(PAPER.ink, .5), GOLD.mid, 0); ctx.fillStyle = fixed > 0 ? mixHex(mixHex(PAPER.ink, PAPER.body, .45), GOLD.mid, fixed) : rgba(PAPER.ink, .5);
        ctx.fillRect(x0, y, gx - gw / 2 - x0, 6); ctx.fillRect(gx + gw / 2, y, x0 + w - gx - gw / 2, 6);
      }
      // 7.10 the cream mark around the gap
      const mk = span(t, A.people + .6, A.people + 1.3) * (1 - span(t, A.parl + .8, A.parl + 1.4));
      if (mk > 0) { const pts = []; for (let k = 0; k <= 40; k++) { const a = -2.4 + k / 40 * TAU * 1.05; pts.push([GAPX - DC.x + Math.cos(a) * 92, lineY(GAPI) - DC.y + 3 + Math.sin(a) * 38]); } X.lightLine(ctx, pts, mk, { w: 3, a: .9 }); }
      ctx.restore();
    }
    // 7.09 the chip rolls along the line and through the gap
    const cu = span(t, A.casinos - .1, A.casinos + 1.8);
    if (cu > 0 && cu < 1) { const x = lerp(DC.x - DC.w / 2 - 60, DC.x + DC.w / 2 + 80, sineIO(cu)), dip = Math.max(0, 1 - Math.abs(x - GAPX) / 70) * 10; chip(ctx, x, lineY(GAPI) - 22 + dip, 22, x / 22, clamp(cu * 8) * clamp((1 - cu) * 8)); }
    X.label(ctx, 'UNTAXED', DC.x + DC.w / 2 + 40, lineY(GAPI) + 10, B.lab(t, A.untaxed - .05, A.citizen + .1), { size: 34, spacing: .14, align: 'left', gold: .2 });
    // 7.10 the readers
    for (let i = 0; i < 3; i++) {
      const u = expoOut(span(t, A.people - .1 + i * .08, A.people + .6 + i * .08)); if (u <= 0 || t > A.cow) continue;
      const x = DC.x - DC.w / 2 - 70 - i * 95, pt = i === 0 ? sineIO(span(t, A.people + .3, A.people + .9)) : 0, hand2 = i === 0 ? span(t, A.citizen, A.citizen + .7) * (1 - span(t, A.citizen + 1.4, A.citizen + 2)) : 0;
      ctx.save(); ctx.beginPath(); ctx.rect(x - 150, 860 - 400, 300, 402); ctx.clip();
      E.person(ctx, x, 860 + (1 - u) * 140, 130, { dir: 1, light: .8, rim: LAMP.body, look: .3 * pt, armR: [lerp(.15, 2.3 - .3 * hand2, Math.max(pt, hand2)), lerp(.1, 2.4 - .6 * hand2, Math.max(pt, hand2))], armL: [-.15, -.1] });
      ctx.restore();
    }
    // 7.10b–7.11 the two windows
    for (const [Wn, k] of [[WL, 0], [WR, 1]]) {
      const box = B.chatWin(ctx, t, Wn.x, Wn.y, WW, WH, { u: span(t, A.citizen + .8 + k * .2, A.citizen + 1.6 + k * .2), title: 'CHATBOT' });
      if (!box) continue;
      B.inkLines(ctx, box.x0, box.y0 + 10, box.w, 5, span(t, A.citizen + 1.4, A.found - .1), { gap: 30, h: 5, col: rgba(COOL.core, .45) });
      const g = span(t, A.found + .2 + k * .25, A.found + .7 + k * .25);
      if (g > 0) F.goldSpan(ctx, [[box.x0, box.y0 + 10 + 2 * 30 + 12], [box.x0 + box.w * .9, box.y0 + 10 + 2 * 30 + 12]], 0, g, { w: 2.4, spark: g < 1 });
      const gl = span(t, A.found + .8 + k * .2, A.found + 1.4 + k * .2) * (1 - span(t, A.parl + .2, A.parl + .8));
      if (gl > 0) { const dd = docT(t), gy = dd.y + (lineY(GAPI) - DC.y) * dd.s, gx = dd.x + (GAPX - DC.x) * dd.s; X.lightLine(ctx, [[k ? box.x0 : box.x0 + box.w * .9, box.y0 + 82], [gx + (k ? 40 : -40), gy]], gl, { w: 2, a: .8, col: rgba(GOLD.line, .8) }); }
    }
    if (mu > 0) B.magnifier(ctx, mx, my, 64, { a: clamp(mu * 3), lit: span(t, A.found, A.found + .5) });
    // 7.12: LAW CORRECTED · 7.13: the fixed line drops into her hill
    const dd = docT(t);
    F.verdict(ctx, t, dd.x, dd.y + DC.h / 2 * dd.s + 62, SRC.lawFixed, span(t, A.parl + .5, A.parl + 1.2) * (1 - span(t, A.cow + .6, A.cow + 1.1)), { size: 30 });
    const drop = span(t, A.cow - .45, A.cow + .45);
    if (drop > 0) { const gx = dd.x + (GAPX + DC.w / 2 - 44 - DC.x) * dd.s, gy = dd.y + (lineY(GAPI) - DC.y) * dd.s; X.lightLine(ctx, [[gx, gy + 4], [gx + 260, 960], [-3720, RIDGE(-3720)]], drop, { w: 3, col: rgba(GOLD.line, .9) }); }
  }
  const chip = B.chip;
  // ---------------------------------------------------------------- 7.13–7.14: the cow gets an interpreter (★)
  const RIDGE = (x) => 1100 + ((x + 3300) / 900) ** 2 * 120, COWX = -3460, INT = { x: -3080, h: 250 }, TRADE = { y: 690, x0: -4300, x1: -2300 };
  function cowScene(ctx, t) {
    if (t < A.cow - .6 || t > A.hard + 2) return;
    const ru = span(t, A.cow + .25, A.cow + 1.25), ridge = (a, b) => { const p = []; for (let i = 0; i <= 40; i++) { const x = lerp(a, b, i / 40); p.push([x, RIDGE(x)]); } return p; };
    // the warm pool on the pair (the wow)
    const wl = span(t, A.cow + 1.2, A.interp + .3);
    if (wl > 0) halo(ctx, -3260, 980, 620, .3 * wl, LAMP.body, LAMP.core);
    if (ru > 0) {
      const L = ridge(lerp(-3720, -5200, expoOut(ru)), lerp(-3720, -1500, expoOut(ru)));
      ctx.fillStyle = mixHex(P.night0, P.ind1, .22); ctx.beginPath(); ctx.moveTo(L[0][0], 2600); L.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(L[L.length - 1][0], 2600); ctx.fill();
      X.lightLine(ctx, ridge(-3720, -5200), ru, { w: 2.5, a: .6 }); X.lightLine(ctx, ridge(-3720, -1500), ru, { w: 2.5, a: .6 });
    }
    const cu = 1 - (1 - span(t, A.cow + .4, A.cow + 1.7)) ** 3;   // cubic out: no lurch on the rise
    if (cu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(COWX - 500, RIDGE(COWX) - 800, 1000, 802); ctx.clip();
      F.cow(ctx, t, COWX, RIDGE(COWX) + (1 - cu) * 320, 290, { dir: 1, graze: .15 + .1 * Math.sin(t * .5) ** 2, look: .5 * span(t, A.interp - .4, A.interp + .4) });
      ctx.restore(); }
    const iu = 1 - (1 - span(t, A.cow + .8, A.cow + 1.9)) ** 3, iy = RIDGE(INT.x);
    if (iu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(INT.x - 300, iy - 600, 600, 602); ctx.clip();
      const hs = E.person(ctx, INT.x, iy + (1 - iu) * INT.h * 1.1, INT.h, { dir: -1, light: 1, rim: LAMP.body, look: -.2 + .15 * Math.sin(t * .8), armR: [1.5, 2.1], armL: [1.2, 2.0] });
      ctx.restore();
      // the sheet he reads from, and the words he passes on to her (small warm arcs)
      ctx.save(); ctx.translate(INT.x - 70, iy - INT.h * .62); ctx.rotate(-.12); B.sheet(ctx, 0, 0, 58, 74, { a: iu }); ctx.restore();
      const sp = span(t, A.cow + 1.6, A.cow + 2.2);
      if (sp > 0) for (let k = 0; k < 3; k++) { const ph = ((t * .8 + k / 3) % 1); ctx.strokeStyle = rgba(LAMP.body, .7 * sp * Math.sin(Math.PI * ph)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(INT.x - 120 - ph * 90, iy - INT.h * .8, 22 + ph * 26, Math.PI * .75, Math.PI * 1.25); ctx.stroke(); }
    }
    // the line of trade above her: coins pass, each now carries a word
    const tu = span(t, A.cow + 1.0, A.cow + 1.8);
    if (tu > 0) {
      X.lightLine(ctx, [[-3300, TRADE.y], [TRADE.x0, TRADE.y]], tu, { w: 2, a: .55 }); X.lightLine(ctx, [[-3300, TRADE.y], [TRADE.x1, TRADE.y]], tu, { w: 2, a: .55 });
      const WORDS = ['PRICE', 'SOLD', 'BOUGHT', 'MARKET'], n = WORDS.length, span_ = TRADE.x1 - TRADE.x0;
      for (let i = 0; i < n; i++) {
        const x = TRADE.x1 - ((i * span_ / n + (t - A.cow) * 70) % span_), e = clamp(Math.min((x - TRADE.x0) / 200, (TRADE.x1 - x) / 200)) * span(t, A.cow + 1.5, A.cow + 2.1);
        F.coin(ctx, t, x, TRADE.y - 24, 18, { flip: (t * .3 + i * .25) % 1 * .2, a: e });
        ctx.save(); ctx.globalAlpha *= e; X.label(ctx, WORDS[i], x, TRADE.y + 40, 1, { size: 24, spacing: .12, col: CREAM }); ctx.restore();
      }
    }
    F.verdict(ctx, t, INT.x, iy - INT.h - 60, 'AN INTERPRETER', span(t, A.interp - .1, A.interp + .5) * (1 - span(t, A.best - .3, A.best + .2)), { size: 34 });
    B.big(ctx, 'THE BEST ARGUMENT', -3300, 900 - 540 + 175 / 1.05, 80, B.lab(t, A.best - .05, A.hard - .2), { gold: .2 });
    B.big(ctx, 'AND IT IS REAL', -3300, 900 - 540 + 262 / 1.05, 80, B.lab(t, A.real - .1, A.hard - .1), { gold: 1 });
  }
  // ---------------------------------------------------------------- 7.15–7.17: the hard look
  const LE = { x: -500, y: 830, w: 250, h: 250 }, SU = { x: -880, y: 840, w: 240 }, BT = { x: -110, y: 830 };
  function lecternScene(ctx, t) {
    if (t < A.hard - .4 || t > A.sa2 + 2.2) return;
    const sp = span(t, A.hard + .9, A.hard + 1.6), fl = sp * (1 - .35 * Math.sin(Math.PI * span(t, A.hard + .9, A.hard + 1.2)));
    if (sp > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, 0, -60, 0, LE.y, [[0, rgba(LAMP.body, .26 * fl)], [1, rgba(LAMP.body, .05 * fl)]]);
      ctx.beginPath(); ctx.moveTo(LE.x - 60, -60); ctx.lineTo(LE.x + 60, -60); ctx.lineTo(LE.x + 330, LE.y); ctx.lineTo(LE.x - 330, LE.y); ctx.fill(); ctx.restore();
      halo(ctx, LE.x, LE.y - 330, 320, .25 * fl, LAMP.body, LAMP.core); }
    const ru = expoOut(span(t, A.hard + .2, A.hard + 1.2));
    if (ru > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(LE.x - 400, LE.y - 600, 800, 602); ctx.clip(); ctx.translate(0, (1 - ru) * 420);
      E.person(ctx, LE.x + 10, LE.y - 10, 310, { dir: 1, light: .35 + .4 * sp, rim: LAMP.body, look: .1 * Math.sin(t * .4), armR: [.7, 1.2], armL: [-.7, -1.2] });
      B.lectern(ctx, LE.x, LE.y, LE.w, LE.h);
      ctx.restore();
      const top = LE.y - LE.h - 16, sw = (k) => .1 * Math.sin(t * 2.4 + k) * Math.exp(-2 * Math.max(0, t - A.hist - k * .4)) + .02 * Math.sin(t * .9 + k);
      B.tag(ctx, LE.x - 62, top + 18, 22, SRC.speaker[0], span(t, A.hist + .3, A.hist + .8), sw(0));
      B.tag(ctx, LE.x + 72, top + 18, 22, SRC.speaker[1], span(t, A.books - .1, A.books + .4), sw(1));
      B.tag(ctx, LE.x + 4, top + 18, 92, SRC.speaker[2], span(t, A.lect - .05, A.lect + .45), sw(2));
    }
    // the book table in the foyer
    const bu = expoOut(span(t, A.books - .3, A.books + .6));
    if (bu > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(BT.x - 260, BT.y - 400, 520, 402); ctx.clip(); ctx.translate(0, (1 - bu) * 260);
      halo(ctx, BT.x, BT.y - 170, 260, .3 * span(t, A.books, A.books + 1), LAMP.body, LAMP.core);
      ctx.fillStyle = mixHex(P.night1, P.blue1, .4); ctx.fillRect(BT.x - 150, BT.y - 120, 300, 12); ctx.fillRect(BT.x - 130, BT.y - 108, 12, 108); ctx.fillRect(BT.x + 118, BT.y - 108, 12, 108);
      for (let s = 0; s < 3; s++) for (let k = 0; k < 3 + (s % 2); k++) { ctx.fillStyle = k % 2 ? PAPER.body : mixHex(LAMP.deep, PAPER.shade, .5); ctx.fillRect(BT.x - 120 + s * 85, BT.y - 120 - (k + 1) * 16, 70 - k * 3, 14); }
      ctx.restore();
    }
    // 7.17 the suitcase
    const su = expoOut(span(t, A.prague + .1, A.prague + .9));
    if (su > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(SU.x - 300, SU.y - 600, 600, 602); ctx.clip(); ctx.translate(0, (1 - su) * 260);
      const op = span(t, A.suit - .1, A.suit + .7), sc = B.suitcase(ctx, SU.x, SU.y, SU.w, op);
      // the empty pocket for answers, on its front
      const pu = span(t, A.noans - .1, A.noans + .4);
      ctx.save(); ctx.globalAlpha *= clamp(op * 2); ctx.setLineDash([6, 6]); ctx.strokeStyle = rgba(CREAM, .5 + .4 * pu); ctx.lineWidth = 2; ctx.strokeRect(SU.x - 70, SU.y - 74, 140, 56); ctx.restore();
      ctx.restore();
      X.label(ctx, 'ANSWERS', SU.x, SU.y - 36, span(t, A.noans - .05, A.noans + .45), { size: 22, spacing: .12, col: CREAM });
      // what flies out: quotation marks (metaphors) and question marks
      const ITEMS = [['“', -1150, 380, A.meta - .2], ['?', -1010, 300, A.quest - .1], ['“', -870, 420, A.meta], ['?', -760, 330, A.quest + .1], ['“', -1080, 500, A.meta + .2], ['?', -930, 470, A.quest + .3]];
      ITEMS.forEach(([g, x1, y1, t1], i) => {
        const u = span(t, Math.max(t1 - .4, A.suit + .3), Math.max(t1 - .4, A.suit + .3) + 1.1); if (u <= 0) return;
        const e = expoOut(u), x = lerp(SU.x, x1, e) + 10 * Math.sin(t * .7 + i), y = lerp(SU.y - 100, y1, e) - Math.sin(Math.PI * Math.min(1, u * 1.2)) * 80 + 8 * Math.sin(t * .9 + i * 2);
        B.gold(ctx, [[g, g === '?' ? .2 : 0]], x, y + 30, g === '?' ? 76 : 96, clamp(u * 3), { serif: true, align: 'center', glow: true });
      });
      X.label(ctx, 'METAPHORS', -1120, 590, span(t, A.meta - .1, A.meta + .5) * (1 - span(t, A.sa2 - .5, A.sa2)), { size: 26, spacing: .16 });
      X.label(ctx, 'GOOD QUESTIONS', -850, 590, span(t, A.quest - .1, A.quest + .5) * (1 - span(t, A.sa2 - .5, A.sa2)), { size: 26, spacing: .16 });
    }
  }
  // ---------------------------------------------------------------- 7.18–7.20: two windows → the anvil (plateAnvil)
  const W7 = [{ x: 560, y: 470 }, { x: 1360, y: 470 }], W7w = 640, W7h = 400;
  const foldU = (t) => sineIO(span(t, A.how + 1.75, tP - .02)), anvU = (t) => sineIO(span(t, A.how + 2.05, tP - .02));
  function finale(ctx, t) {
    if (t < A.sa2 - .2) return;
    const f = foldU(t), a = S.ANVIL;
    // the anvil body unfolds down from the line the windows fold into
    const au = anvU(t);
    if (au > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, a.top - 3, W, (a.w * .42 + 6) * au); ctx.clip(); S.anvil(ctx, t, a.x, a.top, a.w); ctx.restore(); }
    for (let k = 0; k < 2; k++) {
      const u = span(t, A.sa2 + .05 + k * .3, A.sa2 + .85 + k * .3); if (u <= 0) continue;
      const tx = k ? (a.x - a.w * .5 + a.w * .82 * .75) : (a.x - a.w * .5 + a.w * .82 * .25), x = lerp(W7[k].x, tx, f), w = lerp(W7w, a.w * .82 / 2, f), h = lerp(W7h, 3, f), y = lerp(W7[k].y, a.top + h / 2 - 1.5, f);
      if (f >= .995) continue;
      const box = B.chatWin(ctx, t, x, y, w, h, { u, title: f < .2 ? 'CHATBOT' : null, a: 1 });
      if (!box || f > .6) continue;
      ctx.save(); ctx.beginPath(); ctx.rect(box.x0 - 10, box.y0 - 10, box.w + 20, Math.max(0, box.h + 10)); ctx.clip();
      for (let i = 0; i < 6; i++) {
        const ly = box.y0 + 14 + i * 40, lw = box.w * (.92 - (i % 3) * .1);
        if (k === 0 && i === 2) { const d = span(t, A.sa2 + 1.7, A.sa2 + 3.0); if (d > 0) { B.dustLine(ctx, box.x0, ly, lw, 6, d, 77, rgba(COOL.core, .6)); continue; } }
        ctx.fillStyle = rgba(COOL.core, .45); ctx.fillRect(box.x0, ly, lw, 6);
        if (k === 1 && i === 2) { const g = span(t, A.est2 + 1.1, A.est2 + 1.7); if (g > 0) F.goldSpan(ctx, [[box.x0, ly + 16], [box.x0 + lw, ly + 16]], 0, g, { w: 2.4, spark: g < 1 }); }
      }
      ctx.restore();
      if (k === 1) { const mu = span(t, A.est2 + .3, A.est2 + 1.0) * (1 - span(f, 0, .3)); if (mu > 0) B.magnifier(ctx, lerp(box.x0 + box.w + 40, box.x0 + box.w * .55, sineIO(mu)), box.y0 + 14 + 2 * 40 - 4, 50, { a: clamp(mu * 3), lit: .6 }); }
    }
    X.label(ctx, 'SOUTH AFRICA', W7[0].x, 225, B.lab(t, A.sa2 + .4, A.how + 1.7), { size: 30, spacing: .18 });
    X.label(ctx, 'ESTONIA', W7[1].x, 225, B.lab(t, A.est2 - .05, A.how + 1.7), { size: 30, spacing: .18 });
    B.big(ctx, 'WHICH ONE DESERVES YOUR TRUST?', W / 2, 150, 68, B.lab(t, A.how - .05, A.how + 2.2), { gold: .3 });
    // the three moulds rise out of the anvil's top; halos as in plateAnvil
    const mu2 = expoOut(span(t, A.how + 2.3, tP - .02));
    if (mu2 > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, a.top - 1); ctx.clip();
      for (let i = 0; i < 3; i++) { const dy = (1 - mu2) * 130; F.chainLink(ctx, t, S.moldX(i), a.top - 52 + dy, 170, 0, { mould: 1 }); halo(ctx, S.moldX(i), a.top - 52 + dy, 150, (.18 + .06 * Math.sin(t * 2 + i)) * mu2, LAMP.body, LAMP.core); }
      ctx.restore(); }
  }

  // ---------------------------------------------------------------- the take
  function draw(ctx, t) {
    if (t >= tP) { S.plateAnvil(ctx, t, T); return; }
    const v = view(t), pk = span(t, A.how + 1.6, tP - .02);
    B.ground(ctx, t, v, { lx: v.x, ly: lerp(v.y - 60, S.ANVIL.top - 80, sineIO(pk)) });
    X.inView(ctx, v, () => { noBlock(ctx, t); ride(ctx, t); estonia(ctx, t, v); cowScene(ctx, t); lecternScene(ctx, t); finale(ctx, t); });
    // the HUD; at the end its links settle into the small row of plateAnvil
    const hf = sineIO(span(t, A.how + 1.6, tP - .05));
    B.hud(ctx, t, T, { f: hf, label: hf > 0 ? false : undefined, lit: hf > 0 ? [0, 0, 0, 0] : undefined,
      to: (i) => ({ x: W / 2 + (i - 1.5) * 120, y: 250, L: 90, ang: 0 }), toE: (i) => ({ x: W / 2 + (i - 1) * 120, y: 250, L: 50, ang: 0 }) });
    F.source(ctx, t, A.musk + .3, A.optim - .2, SRC.musk);
    F.source(ctx, t, A.people + .2, A.parl + .2, SRC.estonia);
    F.source(ctx, t, A.parl + .4, A.cow + .9, SRC.lawFixedSrc);
    F.source(ctx, t, A.prague + .6, A.sa2 - .1, SRC.seznam);
  }
  return [{ t: R.a, draw, print: PR }];
};
