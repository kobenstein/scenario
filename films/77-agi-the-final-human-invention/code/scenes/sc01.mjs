// c01 · Hook (lead, the quality reference) · 0 → T.G('Here is the promise'). Plan: docs/shots.md H.01–H.23 · motion bible: docs/MOTION.md.
// NOT one world: 23 sentences, 23 motifs, each joined to the next by a CARRIER (column "carrier"). One entry, one draw function; the motifs
// are scheduled on VO phrases (never seconds); transitions are transformations or a camera that follows the carrier, never fades or cuts.
//
// | ID    | anchor (phrase)          | motif                                                                                        | type  | carrier → next           |
// |-------|--------------------------|----------------------------------------------------------------------------------------------|-------|--------------------------|
// | H.01  | A.G.I. may be the final  | THUMBNAIL: THE BOARD (HUMAN INVENTIONS, last row glowing), the ring behind, you tiny; FINAL HUMAN INVENTION, a gold rule under each spoken word | MIX | the LIGHT BULB row |
// | H.02  | Look around you          | the row slides out, falls (the camera tilts down after it) and becomes the bulb in your room | SCENE | the bulb                 |
// | H.03  | The light over your head | the bulb flickers on, its cone falls on you                                                  | SCENE | your hand                |
// | H.04  | The phone in your hand   | the phone lights                                                                             | SCENE | the phone glow           |
// | H.05  | The screen in front      | the wall screen lights                                                                       | SCENE | the three lights         |
// | H.06  | Each of them was         | the lights leave as cream outlines; pull back to three inventors whose lamps they light       | MIX   | the three icons          |
// | H.07  | So was every invention   | the icons drop into rows of a list column; it runs upward ever faster                        | EXPL  | the column               |
// | H.08  | A.G.I. would be the last | it brakes on its empty last row; A.G.I. flaps in, gold                                       | EXPL  | the letters              |
// | H.09  | Artificial general       | the row unfolds the long form; the ring forms; a head; its light flows into the ring          | EXPL  | the ring                 |
// | H.10  | Including invent         | the row folds back; a stylus of light lifts off the ring by itself                           | EXPL  | the stylus               |
// | H.11  | From then on             | beside the human column the stylus draws a second column; you walk in at its foot            | EXPL  | the second column        |
// | H.12  | Faster than we ever      | ★ the race: the second column shoots up out of frame, pull back                               | EXPL  | the first dashed row     |
// | H.13  | So what will it invent   | back down at its foot: the question rises word by word, you look up                          | MIX   | the first row            |
// | H.14  | The inventing has        | the first row fills solid gold: ALREADY BEGUN                                                | EXPL  | the gold row             |
// | H.15  | This year, an A.I.       | the gold row unfolds into a page with dots; one bright line · NO HUMAN HAD FOUND IT           | EXPL  | the page                 |
// | H.16  | To a puzzle about dots   | pairs at the same distance light as equal strokes; the question on the page                  | EXPL  | the page                 |
// | H.17  | Guess how long           | two empty drums rise from behind the page: – – YEARS                                         | EXPL  | the drums                |
// | H.18  | Eighty years             | the drums roll and land heavy on 80 · ERDŐS UNIT-DISTANCE CONJECTURE · …                     | EXPL  | a gold thread            |
// | H.19  | A mathematician who      | card “a milestone in AI mathematics” — TIMOTHY GOWERS · COMMENTARY REQUESTED BY OPENAI        | EXPL  | the card                 |
// | H.20  | But the idea of a final  | the card folds into an empty glowing row; it stretches into the band; the sentence types     | EXPL  | the band                 |
// | H.21  | Half promise             | the front half lights gold · PROMISE                                                         | EXPL  | the band                 |
// | H.22  | Half condition           | the dashed cream cover slides over the back half · CONDITION                                 | EXPL  | the cover                |
// | H.23  | And the condition is     | you walk in under the cover and look up · UP TO US → S.plateBand                             | MIX   | the band (seam plate)    |
import * as F from '../lib/f77_kit.mjs';
import * as S from '../lib/f77_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, rise, GOLD, CREAM, PAPER } = F;

export const PRINT = F.PRINT77;
export default async (T, R) => {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.agi0 = G('A.G.I. may be'); a.final = G('final human', a.agi0); a.human = G('human invention', a.agi0); a.inv = G('invention', a.human);
  a.look = G('Look around you');
  a.light = G('The light over'); a.phone = G('phone in your hand'); a.screen = G('screen in front');
  a.each = G('Each of them'); a.them = G('them', a.each); a.invented = G('invented by a person');
  a.so = G('So was every'); a.every = G('every invention', a.so);
  a.agi1 = G('A.G.I. would be');
  a.art = G('Artificial general'); a.machine = G('a machine that', a.art); a.mind = G('human mind does', a.art); a.does = GE('human mind does', a.art);
  a.incl = G('Including invent'); a.invent = G('invent', a.incl + .3);
  a.from = G('From then on'); a.forus = G('for us', a.from);
  a.faster = G('Faster than we');
  a.what = G('So what will it'); a.whatW = F.wordTimes(T, 'So what will it invent for you', null, a.what - .1);
  a.begun = G('The inventing has'); a.already = G('already begun', a.begun);
  a.year = G('This year, an'); a.found = G('found an answer', a.year); a.nohuman = G('no human had', a.year);
  a.puzzle = G('To a puzzle'); a.dots = G('dots on a page', a.puzzle);
  a.guess = G('Guess how long');
  a.eighty = G('Eighty years');
  a.math = G('A mathematician who'); a.milestone = G('a milestone', a.math);
  a.but = G('But the idea'); a.goes = G('goes back', a.but); a.sentE = GE('single sentence', a.but);
  a.halfP = G('Half promise'); a.halfC = G('Half condition'); a.cond = G('And the condition'); a.upto = G('up to us', a.cond);
  a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

// ------------------------------------------------------------------------------------------------ layout (world px; the frame is 1920 × 1080)
const BRD = { x: 1080, y: 70, w: 600, rowH: 80, head: 112 };                 // the thumbnail board
const LB = 4;                                                                // its LIGHT BULB row
const TTL = { x: 82, y: 330, lead: 190 };
const RO = [0, 1250];                                                        // your room box, below the thumbnail (world offset of its local space)
const C = { x: 3000, y: 1700 };                                              // the column space: the human column centre, the A.G.I. row centre
const ROWH = 64, COLW = 560, C2X = 3380;                                     // rows; the second column's left edge
const SLOTS = [[2600, 1460], [3000, 1460], [3400, 1460]];                    // the three icons above the inventors
const FEET = 1940;
const LIST = ['FIRE', 'THE WHEEL', 'WRITING', 'THE PLOUGH', 'GLASS', 'PAPER', 'THE COMPASS', 'THE CLOCK', 'PRINTING PRESS', 'THE TELESCOPE', 'STEAM ENGINE',
  'THE RAILWAY', 'THE CAMERA', 'LIGHT BULB', 'TELEPHONE', 'TELEVISION', 'RADIO', 'THE AIRPLANE', 'THE REFRIGERATOR', 'THE TRANSISTOR', 'THE LASER',
  'THE COMPUTER', 'SATELLITES', 'SOLAR CELLS', 'THE INTERNET', 'THE SMARTPHONE'];
const ILB = 13, LAST = LIST.length;                                          // LIGHT BULB index; the empty last row
const S_END = LAST - ILB + 20 / ROWH;                                        // the scroll that brings the last row's centre to C.y
const N2 = 70;                                                               // rows of the second column in the race
const SHEET = { cx: 3660, w: 760, h: 520, bottom: C.y + 32 };                // the dot page grows up out of the gold row
const CNT = { x: 3660, y: 960, size: 150 };                                  // the drums (world)
const YOU2 = { x: 4010, feet: C.y + 40, h: 150 };                            // you at the second column's foot
const CARD = { x: 1200, y: 330, w: 640, h: 290 };                            // the Gowers card (screen)

function scene(a, T) {
  const tPlate = a.end - S.SEAM_HALF, t0 = a.end;
  // ---------------------------------------------------------------- the world camera (keys on phrases; it trails the carrier, never leads it)
  const tFall0 = a.look - .22, tFall1 = a.look + .93;                        // the LIGHT BULB row falls into your room
  const tPan1 = a.each + 1.75;
  const sc0 = a.every + .3, sc1 = a.agi1 - .05;                              // the scroll of the human column
  const tBand = a.but + .95;                                                 // the card has become the empty row: from here the plate's creep space
  const K = [
    [0, 960, 540, 1], [tFall0 + .25, 985, 560, 1.035], [tFall1 + .35, 960, RO[1] + 540, 1],
    [a.screen - .2, 990, RO[1] + 535, 1.05], [a.each, 1080, RO[1] + 530, 1.07],
    [a.each + .75, 1900, RO[1] + 470, .62], [tPan1, 2960, C.y, .95], [a.so, 3000, C.y, 1], [sc1 + .3, 3000, C.y, 1.035],
    [a.art - .35, 3000, C.y, 1.03], [a.art + .9, 3000, C.y + 255, 1], [a.incl - .15, 3000, C.y + 262, 1],
    [a.from - .1, 3330, C.y - 140, .9], [a.faster - .05, 3330, C.y - 160, .88], [a.what - .35, 3330, 700, .42],
    [a.what + 1, 3960, 1480, 1], [a.year, 3960, 1480, 1.01], [a.year + 1.4, SHEET.cx, 1500, 1.08], [a.guess - .1, SHEET.cx, 1505, 1.08],
    [a.guess + 1.2, SHEET.cx, 1180, .8], [a.math - .1, SHEET.cx, 1180, .8], [a.math + .9, 3960, 1180, .8], [a.milestone + .45, 3990, 1180, .8], [tBand, 5000, 1180, 1.25],
  ];
  const cam = (t) => { const c = F.lookPath(Math.min(t, tBand), K), k = t - (a.eighty + .1); if (k > 0) c.cy += 6 * Math.exp(-k * 7) * Math.sin(k * 44) / c.z; return c; };
  const camEnd = F.lookPath(tBand, K);
  const scroll = (t) => {
    const u = span(t, sc0, sc1), f = u < .72 ? .62 * Math.pow(u / .72, 2.6) : .62 + .38 * (1 - Math.pow(1 - (u - .72) / .28, 1.65));
    const k = t - sc1; return S_END * f + (k > 0 ? .16 * Math.exp(-k * 5) * Math.sin(k * 13) : 0);
  };
  // the race: when each row of the second column is drawn (rows 0–3 steady, then ever faster)
  const tRow = (k) => (k < 4 ? a.from + .05 + k * .5 : a.faster - .02 + 1.55 * Math.sqrt((k - 4) / (N2 - 4)));
  const dRow = (k) => (k < 4 ? .42 : Math.max(.06, .21 * Math.sqrt(1 - (k - 4) / (N2 - 4))));
  const colDim = (t) => 1 - .62 * smooth(span(t, a.year, a.year + 1));      // the columns step back behind the page
  let roomOut = null;   // what room() returned last (your hand)

  // ---------------------------------------------------------------- H.01 the thumbnail
  const ttl = { size: 200, cond: .6 };
  { const wMax = F.titleWidth('INVENTION', ttl.size, ttl.cond); if (wMax > 900) ttl.size *= 900 / wMax; }
  const drawThumb = (ctx, t) => {
    F.ring(ctx, t, 1655, 300, 230, { lit: .9, think: .4 });
    const rows = F.INVENTIONS.map((s, i) => (i === LB && t > tFall0 ? { text: '' } : { text: s })).concat([{ empty: true }]);
    F.board(ctx, t, BRD.x, BRD.y, { w: BRD.w, rowH: BRD.rowH, head: BRD.head, title: 'HUMAN INVENTIONS', cells: 15, rows });
    F.du(ctx, 1010, 958, 108, { dir: 1, look: .9, light: .7 });
  };
  const drawTitle = (ctx, t) => {
    const out = sineIO(span(t, a.look - .3, a.look + .2)); if (out >= 1) return;
    const words = ['FINAL', 'HUMAN', 'INVENTION'], ts = [a.final, a.human, a.inv];
    F.titleWords(ctx, words.map((w) => [{ w, u: 1 }]), TTL.x, TTL.y, { size: ttl.size, cond: ttl.cond, lead: TTL.lead, out });
    words.forEach((w, i) => {   // a gold rule under each word as it is spoken; it retracts as the title sinks
      const u = expoOut(span(t, ts[i] - .05, ts[i] + .4)) * (1 - smooth(clamp(out * 1.6))), ww = F.titleWidth(w, ttl.size, ttl.cond) - ttl.size * .1, y = TTL.y + i * TTL.lead + 24;
      if (u > 0) F.goldSpan(ctx, [[TTL.x + 4, y], [TTL.x + 4 + ww, y]], 0, u, { w: 3.2 });
    });
  };
  // the LIGHT BULB row as the carrier: slides out of the board, its letters flap away, it falls and becomes the bulb's glass
  const bulbHome = [RO[0] + F.ROOM.bulb[0], RO[1] + F.ROOM.bulb[1]];
  const rowC = [BRD.x + 20 + (BRD.w - 40) / 2, BRD.y + BRD.head + LB * BRD.rowH + BRD.rowH / 2];
  const carrier = (ctx, t) => {
    if (t < tFall0 || t > tFall1 + .02) return;
    const sl = sineIO(span(t, tFall0, tFall0 + .3)), fu = span(t, tFall0 + .26, tFall1), e = sineIO(span(t, tFall0 + .26, tFall1 - .3));
    const x0 = rowC[0] - 230 * sl, y0 = rowC[1];
    const x = lerp(x0, bulbHome[0], sineIO(fu)), y = lerp(y0, bulbHome[1], Math.pow(fu, 1.4));
    const w = lerp(BRD.w - 40, 52, e), h = lerp(BRD.rowH, 52, e), r = lerp(6, 26, e);
    F.halo(ctx, x, y, lerp(260, 220, e), .55, GOLD.halo, GOLD.core);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = F.lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, rgba(GOLD.halo, .5)], [.5, rgba(GOLD.hot, .85)], [1, rgba(GOLD.halo, .5)]]);
    ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, r); ctx.fill(); ctx.restore();
    if (e < .4) F.flapText(ctx, t, '', x - w / 2 + 27, y, 32, { from: 'LIGHT BULB', u: span(t, tFall0, tFall0 + .32), cells: 10, col: '#3b2410', tiles: false });
  };
  // the bulb after its cord catches it: a decaying swing
  const bulbAt = (t) => { const k = t - tFall1; if (k <= 0) return F.ROOM.bulb; const L = F.ROOM.bulb[1] - F.ROOM.cord, th = .14 * Math.exp(-k * 1.5) * Math.sin(k * 5.2); return [F.ROOM.bulb[0] + L * Math.sin(th), F.ROOM.cord + L * Math.cos(th)]; };
  const bulbL = (t) => { if (t < tFall1) return 0; const on = span(t, a.light - .06, a.light + .2), fl = on > 0 && on < 1 ? .55 + .45 * Math.sin(t * 95) : 1; return (.28 + .72 * on * fl) * (1 - sineIO(span(t, a.each, a.each + .45))); };
  const phoneL = (t) => expoOut(span(t, a.phone - .05, a.phone + .3)) * (1 - sineIO(span(t, a.each + .1, a.each + .5)));
  const screenL = (t) => { const on = span(t, a.screen - .1, a.screen + .3), fl = on > 0 && on < 1 ? .6 + .4 * Math.sin(t * 70) : 1; return on * fl * (1 - sineIO(span(t, a.them + .05, a.them + .5))); };
  // ---------------------------------------------------------------- H.02–H.05 your room (a cutaway box under the night)
  const drawRoom = (ctx, t) => {
    ctx.save(); ctx.translate(RO[0], RO[1]);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, 1040); ctx.clip();
    roomOut = F.room(ctx, t, { bulb: bulbL(t), phone: phoneL(t), screen: screenL(t), amb: .1, bulbAt: bulbAt(t), bulbGlass: t > tFall1 - .02, look: lerp(.3, .1, span(t, a.screen, a.screen + .6)) });
    ctx.restore();
    // the cutaway: ceiling and floor slabs, thin side walls (the room is a box in the night)
    ctx.fillStyle = mixHex(P.ind2, P.night0, .3); ctx.fillRect(-14, -8, W + 28, 40); ctx.fillRect(-14, 1000, W + 28, 48); ctx.fillRect(-14, -8, 22, 1056); ctx.fillRect(W - 8, -8, 22, 1056);
    ctx.fillStyle = rgba(P.blue1, .7); ctx.fillRect(-14, -8, W + 28, 2); ctx.fillRect(-14, 1046, W + 28, 2);
    ctx.restore();
  };
  // ---------------------------------------------------------------- H.06 the three lights leave as outlines; the inventors
  const ICON = [{ kind: 'bulb', t: a.each, s0: 34, s1: 92 }, { kind: 'phone', t: a.each + .2, s0: 18, s1: 84 }, { kind: 'screen', t: a.them, s0: 270, s1: 118 }];
  const iconSrc = (i) => (i === 0 ? [bulbHome[0], bulbHome[1]] : i === 1 ? (roomOut ? [RO[0] + roomOut.hand[0] + 4, RO[1] + roomOut.hand[1] - 14] : [RO[0] + 790, RO[1] + 700]) : [RO[0] + F.ROOM.screen.x + F.ROOM.screen.w / 2, RO[1] + F.ROOM.screen.y + F.ROOM.screen.h / 2]);
  const iconPos = (i, t) => {   // world position + size of icon i (a flight to its slot, then a drop into its row)
    const I = ICON[i]; if (t < I.t) return null;
    const s0 = iconSrc(i), d = SLOTS[i], p = sineIO(span(t, I.t + .15, I.t + 1.25));
    const c1 = [lerp(s0[0], d[0], .25), Math.min(s0[1], d[1]) - 260];
    let x = (1 - p) ** 2 * s0[0] + 2 * (1 - p) * p * c1[0] + p * p * d[0], y = (1 - p) ** 2 * s0[1] + 2 * (1 - p) * p * c1[1] + p * p * d[1], s = lerp(I.s0, I.s1, sineIO(span(t, I.t + .1, I.t + 1))) * (1 + .03 * Math.sin(t * 2 + i));
    const q = sineIO(span(t, a.so + i * .06, a.so + .5 + i * .06)), rowY = C.y + 20 + i * ROWH;   // the drop into its row (H.07)
    if (q > 0) { const tx = C.x - COLW / 2 + 40, ty = rowY; x = lerp(x, tx, q); y = lerp(y, ty, q) - Math.sin(Math.PI * q) * 60; s = lerp(s, 16, q); }
    return { x, y, s, u: span(t, I.t, I.t + .35), gone: q >= 1 };
  };
  const invLit = (i, t) => expoOut(span(t, ICON[i].t + 1.2, ICON[i].t + 1.5));
  const drawInventors = (ctx, t) => {
    if (t < a.each + .3 || t > a.so + .8) return;
    const gu = smooth(span(t, a.each + .5, a.each + 1.2)) * (1 - smooth(span(t, a.so, a.so + .55)));
    F.outline(ctx, [[[C.x, FEET], [C.x - 620, FEET]], [[C.x, FEET], [C.x + 620, FEET]]], gu, { w: 2, a: .8 });
    SLOTS.forEach(([x], i) => F.inventor(ctx, t, x - 40, FEET, 235, { lit: invLit(i, t), sink: span(t, a.so + i * .05, a.so + .45 + i * .05), dir: i === 2 ? -1 : 1 }));
  };
  const drawIcons = (ctx, t) => {
    for (let i = 0; i < 3; i++) {
      const p = iconPos(i, t); if (!p || p.gone) continue;
      const dir = i === 2 ? -1 : 1, lamp = [SLOTS[i][0] - 40 + dir * 235 * .47, FEET - 235 * .64];
      const th = smooth(span(t, ICON[i].t + 1.05, ICON[i].t + 1.3)) * (1 - span(t, a.so - .25, a.so + .05));
      if (th > 0) F.goldSpan(ctx, [[p.x, p.y + p.s * .9], lamp], 0, th, { w: 1.3, spark: th < 1 });
      F.lineIcon(ctx, ICON[i].kind, p.x, p.y, p.s, { u: p.u, w: 3.2 });
    }
  };
  // ---------------------------------------------------------------- H.07–H.09 the human column, the run of its rows, A.G.I.
  const rowY0 = (s) => C.y + 20 - (ILB + s) * ROWH - ROWH / 2;   // top of row 0
  const flipOf = (i, t) => (i >= ILB && i <= ILB + 2 ? span(t, a.so + .42 + (i - ILB) * .06, a.so + .9 + (i - ILB) * .06) : span(t, a.so + .45 + Math.abs(i - ILB) * .035, a.so + .95 + Math.abs(i - ILB) * .035));
  const agiK = (t) => sineIO(span(t, a.art - .1, a.art + .55)) * (1 - sineIO(span(t, a.incl - .2, a.incl + .35)));
  const drawColumn = (ctx, t) => {
    if (t < a.so + .3) return;
    const s = scroll(t), vel = (scroll(t + .01) - scroll(t - .01)) / .02, y0 = rowY0(s), xL = C.x - COLW / 2, dim = colDim(t);
    const rows = LIST.map((txt, i) => { const f = flipOf(i, t); return f <= 0 ? null : { text: txt, from: '', flip: f, a: smooth(clamp(f * 3)) * lerp(1, .78, span(t, a.from, a.from + 1)) * dim }; });
    // the ledger's side rules (part of the column: they scroll with it)
    const top = y0, bot = y0 + (LAST + 1) * ROWH, ru = smooth(span(t, a.so + .4, a.so + 1.1));
    for (const x of [xL - 8, xL + COLW + 8]) F.goldSpan(ctx, [[x, lerp(C.y, top, ru)], [x, lerp(C.y, bot, ru)]], 0, 1, { w: 1.2, spark: false, a: .55 * dim });
    F.ledger(ctx, t, xL, y0, COLW, ROWH, rows, { cells: 16, vel });
    // the last row: empty and glowing while the column runs; A.G.I. flaps in gold; it unfolds the long form and folds back
    const ly = y0 + LAST * ROWH, k = agiK(t), rw = lerp(COLW, 840, k), typed = span(t, a.agi1 - .02, a.agi1 + .5);
    const long = 'ARTIFICIAL GENERAL INTELLIGENCE', ph = t < a.art - .1 ? 0 : t < a.incl - .2 ? 1 : 2;
    const txt = ph === 1 ? long : 'A.G.I.', from = ph === 0 ? '' : ph === 1 ? 'A.G.I.' : long;
    const fl = ph === 0 ? typed : ph === 1 ? span(t, a.art - .1, a.art + 1.2) : span(t, a.incl - .2, a.incl + .5);
    ctx.save(); ctx.globalAlpha *= dim;
    F.boardRow(ctx, t, C.x - rw / 2, ly, rw, ROWH, { empty: typed < .05, text: typed > 0 ? txt : null, from, flip: fl, gold: smooth(typed), cells: Math.round(lerp(16, 31, k)), lit: .6 * (1 - span(t, a.agi1 + .3, a.agi1 + 1.2)) * (typed > 0 ? 1 : 0) }, { size: lerp(ROWH * .4, ROWH * .36, k), pad: lerp(ROWH * .34, 22, k) });
    ctx.restore();
  };
  // ---------------------------------------------------------------- H.09–H.10 head → ring, the stylus
  const HEAD = [2720, C.y + 410], RING = [3290, C.y + 410];
  const drawMind = (ctx, t) => {
    if (t < a.machine - .2 || t > a.what + 1.2) return;
    const hu = span(t, a.machine + .5, a.machine + 1.4), hl = smooth(span(t, a.mind - .1, a.mind + .4)) * (1 - span(t, a.does + .4, a.does + 1.2) * .6);
    const b = F.headProfile(ctx, t, HEAD[0], HEAD[1], 300, { u: hu, light: hl });
    // the copy: a stream of light from the head into the ring
    const cs = a.mind + .15, ce = a.does + .35, ctl = [lerp(b.brain[0], RING[0], .5), HEAD[1] - 230];
    for (let k = 0; k < 14; k++) { const p = span(t, cs + k * .045, cs + k * .045 + .6); if (p <= 0 || p >= 1) continue; const e = sineIO(p), x = (1 - e) ** 2 * b.brain[0] + 2 * (1 - e) * e * ctl[0] + e * e * RING[0], y = (1 - e) ** 2 * b.brain[1] + 2 * (1 - e) * e * ctl[1] + e * e * RING[1]; F.halo(ctx, x, y, 26, .8, GOLD.halo, GOLD.core); }
    const lit = .25 + .75 * smooth(span(t, ce - .3, ce + .2));
    F.ring(ctx, t, RING[0], RING[1], 118, { u: expoOut(span(t, a.machine - .1, a.machine + .8)), lit, think: lit * .8 });
  };
  const stylusP = (t) => {   // where the stylus tip is (or null)
    const ts0 = a.invent - .05; if (t < ts0) return null;
    const lift = sineIO(span(t, ts0, a.from - .05)), A = RING, B = [C2X + 6, C.y + 26], ctl = [RING[0] + 260, C.y + 120];
    let p = [(1 - lift) ** 2 * A[0] + 2 * (1 - lift) * lift * ctl[0] + lift * lift * B[0], (1 - lift) ** 2 * A[1] + 2 * (1 - lift) * lift * ctl[1] + lift * lift * B[1]];
    if (t >= a.from - .05) {
      let k = 0; while (k < N2 - 1 && t >= tRow(k + 1)) k++;
      const tk = tRow(k), d = dRow(k), q = span(t, tk, tk + d), y = C.y - k * ROWH + 26;
      if (t < tk) p = [C2X + 6, C.y + 26];
      else if (q < 1) p = [C2X + 6 + (COLW - 12) * smooth(q), y];
      else { const r = span(t, tk + d, tRow(k + 1)); p = [lerp(C2X + COLW - 6, C2X + 6, sineIO(r)), y - ROWH * sineIO(r)]; }
      const tEnd = tRow(N2 - 1) + dRow(N2 - 1);
      if (t > tEnd) { const f = t - tEnd; p = [C2X + COLW - 6 - f * 150, C.y - (N2 - 1) * ROWH + 26 - f * 900 - f * f * 2600]; }
    }
    return p;
  };
  const drawCol2 = (ctx, t) => {
    if (t < a.invent) return;
    const m = ctx.getTransform(), ky = m.d, dim = colDim(t);
    const slotU = smooth(span(t, a.invent + .1, a.invent + .6));
    for (let k = 0; k < N2; k++) {
      const tk = tRow(k), d = dRow(k), q = span(t, tk, tk + d), y = C.y - k * ROWH - ROWH / 2, sy = m.f + y * ky;
      if (sy > ctx.canvas.height + 80 || sy < -ROWH * ky - 80) continue;
      if (k === 0 && q <= 0) { if (slotU > 0) F.boardRow(ctx, t, C2X, y, COLW, ROWH, { dashed: true, a: .45 * slotU }); continue; }
      if (q <= 0) continue;
      if (k === 0 && t > a.year + .02) continue;   // the gold row has become the page
      const gold = k === 0 ? smooth(span(t, a.begun + .05, a.begun + .5)) : 0;
      ctx.save(); ctx.beginPath(); ctx.rect(C2X - 4, y - 4, (COLW + 8) * q, ROWH + 8); ctx.clip();
      F.boardRow(ctx, t, C2X, y, COLW, ROWH, { dashed: gold < .5, gold, a: k ? dim : 1, lit: (1 - span(t, tk + d, tk + d + .7)) + (k === 0 ? 1.2 * Math.sin(Math.PI * span(t, a.begun, a.begun + .7)) : 0) });
      ctx.restore();
    }
    const p = stylusP(t);
    if (p && p[1] > -6000) F.stylus(ctx, t, p[0], p[1], 2.05 + .05 * Math.sin(t * 3), 150, { w: 5 });
  };
  // ---------------------------------------------------------------- you (world): walk in at the second column's foot, later walk off
  const walkX = (t) => {   // [x, walking phase, dir, look] or null
    const in0 = a.from + .15, in1 = a.forus + .55, out0 = a.year + .1, out1 = a.year + 1.9;
    if (t < in0) return null;
    const travelIn = 440, M = Math.round(travelIn / 120);
    if (t < in1) { const p = F.powOut(span(t, in0, in1), 1.6); return [YOU2.x + travelIn * (1 - p), Math.PI * 2 * M * (1 - p) + Math.PI * 2, -1, .3]; }
    if (t < out0) return [YOU2.x, Math.PI * 2, -1, lerp(.3, .95, smooth(span(t, a.faster, a.what + .6)))];
    const p = span(t, out0, out1); if (p >= 1) return null;
    const e = p * p * (3 - 2 * p) * .5 + p * .5; return [YOU2.x + 700 * e, Math.PI * 2 * 6 * e, 1, .2];
  };
  const drawYou2 = (ctx, t) => { const w = walkX(t); if (!w) return; const sw = Math.sin(w[1]); F.du(ctx, w[0], YOU2.feet, YOU2.h, { dir: w[2], walk: w[1], look: w[3], armR: [-.42 * sw, -.42 * sw + .3], armL: [.42 * sw, .42 * sw + .3], light: .8 }); };
  const drawGround2 = (ctx, t) => { const u = smooth(span(t, a.from, a.from + .9)) * (1 - smooth(span(t, a.year, a.year + .8))); if (u > 0) F.outline(ctx, [[[C2X - 40, YOU2.feet + 2], [C2X - 40 + 1200 * u, YOU2.feet + 2]]], 1, { w: 1.5, a: .5 * u }); };
  // ---------------------------------------------------------------- H.15–H.18 the page, the drums
  const drawSheet = (ctx, t) => {
    if (t < a.year - .02 || t > tBand) return;
    const g = span(t, a.year - .02, a.year + .95), e = expoOut(g), w = lerp(COLW, SHEET.w, e), k = t - a.eighty - .18, bump = k > 0 ? 7 * Math.exp(-k * 6) * Math.sin(k * 26) : 0;
    F.dotSheet(ctx, t, SHEET.cx - w / 2, SHEET.bottom - SHEET.h + bump, w, SHEET.h, { grow: g, h0: ROWH, dots: span(t, a.year + .45, a.year + 1.3), line: span(t, a.found - .02, a.found + .7), pairs: span(t, a.puzzle + .1, a.dots + .8),
      text: ['HOW MANY PAIRS OF POINTS CAN SIT', 'EXACTLY THE SAME DISTANCE APART?'], textU: span(t, a.dots - .3, a.dots + .8) });
  };
  const drawDrums = (ctx, t) => {
    if (t < a.guess || t > tBand) return;
    const r = expoOut(span(t, a.guess + .05, a.guess + .85)), y = lerp(CNT.y + 190, CNT.y, r);
    ctx.save(); ctx.beginPath(); ctx.rect(SHEET.cx - 700, CNT.y - 200, 1400, SHEET.bottom - SHEET.h - (CNT.y - 200)); ctx.clip();   // they rise from behind the page's top edge
    const wDr = 2 * CNT.size * .66 + CNT.size * .1, lw = F.measure('YEARS', CNT.size * .62, true) + CNT.size * .25;
    F.rollCounter(ctx, t, CNT.x - (wDr + lw) / 2, y, CNT.size, 80, { u: span(t, a.eighty - .72, a.eighty + .12), label: 'YEARS', labelU: span(t, a.guess + .3, a.guess + 1) });
    ctx.restore();
  };
  // ---------------------------------------------------------------- the night ground (stars drift against the camera: parallax)
  const glowAt = (t) => {
    const thumb = [1380, 470, 1050, .85], hero = [960, 520, 950, .5], bandG = S.bandGlow(t);
    const k1 = smooth(span(t, a.look, a.look + 1)), k2 = smooth(span(t, a.but, tBand));
    return thumb.map((v, i) => lerp(lerp(v, hero[i], k1), bandG[i], k2));
  };

  // ======================================================================================================================== draw
  return (ctx, t) => {
    if (t >= tPlate) { S.plateBand(ctx, t, T); return; }
    const c = cam(t);
    F.night(ctx, t, { glow: glowAt(t), ox: -(c.cx - camEnd.cx) * .05, oy: -(c.cy - camEnd.cy) * .05 });
    // ---------------- the world (thumbnail → room → icons → columns → page → drums)
    if (t < tBand + .1) F.look(ctx, c.cx, c.cy, c.z, () => {
      if (t < tFall1 + .5) drawThumb(ctx, t);
      if (t > tFall0 && t < tPan1 + .3) drawRoom(ctx, t);
      drawInventors(ctx, t);
      drawColumn(ctx, t);
      drawMind(ctx, t);
      drawCol2(ctx, t);
      drawGround2(ctx, t);
      drawYou2(ctx, t);
      drawDrums(ctx, t);
      drawSheet(ctx, t);
      drawIcons(ctx, t);
      carrier(ctx, t);
      if (t < a.look + .4) drawTitle(ctx, t);
    });
    // ---------------- screen-space type (≥ 22 px; it rises behind a mask and sinks before the camera could cut it)
    const sp = (x, y) => F.lookPt(c.cx, c.cy, c.z, x, y);
    const io = (i0, o0, d = .5) => span(t, i0, i0 + .6) * (1 - span(t, o0, o0 + d));
    F.capsLabel(ctx, 'INVENTED BY A PERSON', W / 2, 870, io(a.invented, a.so - .1, .4), { size: 26, col: CREAM });
    { const u = io(a.mind - .2, a.incl - .3, .4); if (u > 0) { const [x, y] = sp(C.x, C.y + 150); F.capsLabel(ctx, 'WHAT A HUMAN MIND DOES', x, y, u, { size: 26, col: CREAM }); } }
    F.capsLabel(ctx, 'IT INVENTS FOR US', 1320, 400, io(a.forus - .25, a.what - .5, .4), { size: 26, col: CREAM, align: 'left' });
    { const u = io(a.faster, a.what - .45, .45); if (u > 0) F.verdict(ctx, t, 1320, 470, 'FASTER THAN WE EVER COULD', u, { size: 28, align: 'left' }); }
    if (a.whatW && t > a.what - .2 && t < a.already + .6) F.question(ctx, t, 'So what will it invent for you?', 1010, 400, 60, { ts: a.whatW, align: 'left', out: span(t, a.begun - .1, a.begun + .5) });
    { const u = io(a.already - .05, a.year - .1, .45); if (u > 0) F.verdict(ctx, t, 1010, 430, 'ALREADY BEGUN', u, { size: 36, align: 'left' }); }
    { const u = io(a.nohuman - .1, a.puzzle - .35, .45); if (u > 0) { const [x] = sp(SHEET.cx, 0); F.verdict(ctx, t, x, 196, 'NO HUMAN HAD FOUND IT', u, { size: 32 }); } }
    // the drum captions: anchored under the drums (they move with the camera), they sink before the card folds away
    { const [x, y] = sp(CNT.x, CNT.y + CNT.size * .62), out = a.but - .1;
      F.capsLabel(ctx, 'ERDŐS UNIT-DISTANCE CONJECTURE', x, y + 40, io(a.eighty + .25, out, .4), { size: 26, col: GOLD.text });
      F.capsLabel(ctx, 'DISPROVED BY AN OPENAI MODEL · MAY 2026', x, y + 76, io(a.eighty + .5, out + .06, .4), { size: 22 });
      F.capsLabel(ctx, 'CHECKED BY OUTSIDE MATHEMATICIANS', x, y + 108, io(a.eighty + .75, out + .12, .4), { size: 22 }); }
    // ---------------- H.19 the Gowers card → H.20 the empty row (in the plate's creep space) → H.21–H.23 the band, you
    drawCard(ctx, t, a, sp);
    if (t >= a.but + .1) S.creep(ctx, t, t0, () => drawBandPhase(ctx, t, a));
  };
}

// the Gowers card (screen space); from a.but it folds into the empty row of the band (exact shape match at p = 1)
function drawCard(ctx, t, a, sp) {
  const tIn = a.math + .15; if (t < tIn - .4) return;
  const p = quartIO(span(t, a.but + .1, a.but + .95)); if (p >= 1) return;
  // a gold thread from the answer line on the page to the card (reviewed the answer)
  if (p <= 0) { const [sx, sy] = sp(SHEET.cx + SHEET.w / 2, 1400), th = smooth(span(t, tIn - .35, tIn + .05)) * (1 - span(t, a.math + 1.2, a.math + 1.8)); if (th > 0) F.goldSpan(ctx, [[sx, sy], [CARD.x - 6, CARD.y + CARD.h / 2]], 0, th, { w: 1.6 }); }
  const ui = expoOut(span(t, tIn, tIn + .7)); if (ui <= 0) return;
  // target: the band's empty row in the creep space, mapped to the screen
  const z = S.creepZ(t, a.end), tw = 560 * z, th = 64 * z, tx = W / 2 - tw / 2, ty = H / 2 + (S.BAND.y - (H / 2 - 20)) * z - th / 2;
  // it unfolds out of the thread's end (left edge, mid height): a sliver that opens sideways, then in height (no pop of a bright sheet)
  const uW = smooth(span(t, tIn, tIn + .75)), uH = smooth(span(t, tIn + .05, tIn + .85));
  const cw = CARD.w * (.02 + .98 * uW), ch = CARD.h * (.18 + .82 * uH), cy = CARD.y + (CARD.h - ch) / 2;
  const x = lerp(CARD.x, tx, p), y = lerp(cy, ty, p), w = lerp(cw, tw, p), h = lerp(ch, th, p), r = lerp(8, 6 * z, p);
  ctx.save();
  // the band's own empty row underneath, scaled into the morph rect: at p = 1 it IS the band (no switch visible)
  if (p > 0) { ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(w / 560, h / 64); ctx.translate(-W / 2, -S.BAND.y); F.band(ctx, t, W / 2, S.BAND.y, S.BAND.w, S.BAND.h, { u: 0 }); ctx.restore(); }
  const pa = 1 - smooth(span(p, .1, .85));
  if (pa > 0) {
    ctx.globalAlpha *= pa * smooth(span(t, tIn - .05, tIn + .45));
    ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(x + 8, y + 12, w, h, r); ctx.fill();
    ctx.fillStyle = F.lin(ctx, x, y, x + w, y + h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
    ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.restore();
  // the words (they sink before the fold): “a milestone in AI mathematics”; "milestone" warms to gold ink when it is spoken
  const tu = expoOut(span(t, tIn + .45, tIn + 1.05)) * (1 - span(t, a.but - .15, a.but + .2)); if (tu <= 0) return;
  const gw = clamp((t - a.milestone - .12) / .3), size = 56, x0 = CARD.x + 44, yA = CARD.y + 112;
  let xx = x0; for (const [s, g] of [['“a ', 0], ['milestone', gw], [' in', 0]]) { F.maskLine(ctx, [[s, 0]], xx, yA, size, rise(tu), { col: mixHex(PAPER.ink, GOLD.deep, g * .9), glow: false }); xx += F.measure(s, size, true); }
  F.maskLine(ctx, [['AI mathematics”', 0]], x0, yA + size * 1.2, size, rise(span(tu, .1, 1)), { col: PAPER.ink, glow: false });
  F.capsLabel(ctx, 'TIMOTHY GOWERS, MATHEMATICIAN · MAY 2026', CARD.x + 4, CARD.y + CARD.h + 44, span(tu, .3, 1), { size: 22, col: CREAM, align: 'left' });
  F.capsLabel(ctx, 'COMMENTARY REQUESTED BY OPENAI', CARD.x + 4, CARD.y + CARD.h + 76, span(tu, .4, 1), { size: 22, align: 'left' });
}

// the band phase, drawn in the seam plate's creep space (identical to S.plateBand at the end)
function drawBandPhase(ctx, t, a) {
  const tU = a.but + .95; if (t < tU) return;
  const u = span(t, tU, a.goes + .15), type = span(t, a.goes, a.sentE + .7), gold = sineIO(span(t, a.halfP - .05, a.halfP + .5)), cover = span(t, a.halfC - .05, a.halfC + .7);
  // you: walk in from the right (you left the page that way), stop under the cover on a resting step (= the plate's pose)
  const w0 = a.cond - .25, w1 = a.upto + .55, travel = 860, M = Math.round(travel / 120);
  let you = false, youX, walk, look = .25;
  if (t > w0) { const p = F.powOut(span(t, w0, w1), 1.5); you = true; youX = S.BAND_YOU.x + travel * (1 - p); walk = Math.PI * 2 * M * (1 - p) + Math.PI * 2; look = lerp(.25, 1, smooth(span(t, w1 - .4, w1 + .45))); }
  const sw = Math.sin(walk ?? 0);
  S.bandState(ctx, t, { u, type, gold, cover, empty: 1 - smooth(span(t, tU + .2, tU + .9)), you, youX, walk, look, youO: { armR: [-.42 * sw, -.42 * sw + .3], armL: [.42 * sw, .42 * sw + .3] } });
  const io = (i0, o0) => span(t, i0, i0 + .6) * (1 - span(t, o0, o0 + .4));
  const by = S.BAND.y + S.BAND.h / 2;
  F.capsLabel(ctx, 'PROMISE', S.BAND.x - S.BAND.w / 4, by + 56, io(a.halfP, a.end - 1.1), { size: 28, col: GOLD.text });
  F.capsLabel(ctx, 'CONDITION', S.BAND.x + S.BAND.w / 4, by + 56, io(a.halfC + .1, a.end - 1.0), { size: 28, col: CREAM });
  { const uu = io(a.upto - .05, a.end - .95); if (uu > 0) F.verdict(ctx, t, S.BAND.x + S.BAND.w / 4, by + 118, 'UP TO US', uu, { size: 30 }); }
}
