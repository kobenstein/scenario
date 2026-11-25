// c08 · builder B2 · "This channel exists for one reason" → "Terence Tao is one". Rows: docs/shots.md M.01–M.04, 4.01–4.15.
// One entry, one draw function. Starts inside B.boardAct (shared with c07: identical frame at the seam), ends inside B.stacksAct (shared
// with c09). Between them one world (furnace · page · tag · nine checkers · Gowers card · the problem wall) under one camera (F.lookPath).
//
// | ID   | anchor (phrase)            | motif                                                                                   | type  | carrier → next       |
// |------|----------------------------|-----------------------------------------------------------------------------------------|-------|----------------------|
// | M.01 | This channel exists        | the board (two gold rows) on its stand; many small figures rise in front of it          | SCENE | the figures          |
// | M.02 | So that what it invents    | gold runs from the board's rows to every hand; the hands light                          | SCENE | the light            |
// | M.03 | Want that too?             | one of them, you in yellow, looks up; the others step back into the dark               | SCENE | you                  |
// | M.04 | Then subscribe             | your hand presses the lit button on the board's stand · SUBSCRIBE                       | MIX   | the gold grain       |
// | 4.01 | Why still small?           | the camera dives into row 2: the grain, big · Why still small?                         | EXPL  | the grain            |
// | 4.02 | Because matter is slow     | the board drops away, the grain flies left into a furnace that draws itself around it;  | MIX   | the furnace          |
// |      |                            | it grows slowly, a slow dial · MATTER IS SLOW                                           |       |                      |
// | 4.03 | But in mathematics         | right: a sliver of light unfolds into an empty page · NOTHING TO BUILD                  | EXPL  | the page             |
// | 4.04 | So that's where you can    | the page fills line after line, fast · FULL SPEED; the mini board, DISCOVERY pulses     | EXPL  | the page             |
// | 4.05 | Remember the dots          | the camera leaves the furnace; the writing wipes off, the dot page of the hook returns  | EXPL  | the page             |
// | 4.06 | The A.I. behind that       | a tag swings from the page's corner: NOT A MATH SPECIALIST                              | EXPL  | the tag              |
// | 4.07 | Its maker, OpenAI          | the tag turns and opens into a card: OPENAI · 20 MAY 2026 · “general-purpose reasoning  | EXPL  | the card             |
// |      |                            | model” · ERDŐS PROBLEM #90                                                              |       |                      |
// | 4.08 | Outside mathematicians     | pull back: nine figures rise round the page, each gets a gold tick · 9 OUTSIDE …       | MIX   | the ticks            |
// | 4.09 | One would have recommended | the card opens wider into Gowers' card; “without any hesitation” warms to gold ink      | EXPL  | a gold thread        |
// | 4.10 | And a Google DeepMind      | the thread runs right into a wall of index cards; dozens flip to SOLVED (check mark) ·  | EXPL  | the cards            |
// |      |                            | ALPHAPROOF NEXUS · GOOGLE DEEPMIND · EVERY PROOF MACHINE-CHECKED · PREPRINT, MAY 2026  |       |                      |
// | 4.11 | Two had waited             | two of the Erdős cards come forward: OPEN SINCE 1970 · 56 YEARS                         | EXPL  | the cards            |
// | 4.12 | The cost per solved Erdős  | the other set (OEIS) slides out of the picture; only the 9 Erdős cards stay lit, each   | EXPL  | the 9 cards          |
// |      |                            | with a gold coin · A FEW HUNDRED DOLLARS PER SOLVED PROBLEM · 9 SOLVED ERDŐS PROBLEMS   |       |                      |
// | 4.13 | It cracked only a small    | pull back: the 9 among 353 (unit chart) · 9 OF 353 ERDŐS PROBLEMS                       | EXPL  | the bottom row       |
// | 4.14 | But this fall              | three cards drop out of the bottom row and open into calendar leaves SEP · OCT · NOV;  | EXPL  | the stacks           |
// |      |                            | on each a stack lands, stamped CLAIM                                                    |       |                      |
// | 4.15 | Some so big                | the stacks grow faster than a line of three checkers can stamp · NOT YET CHECKED        | MIX   | the stacks (c09)     |
import * as F from '../lib/f77_kit.mjs';
import * as B from '../lib/b2_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, prng, GOLD, CREAM, PAPER, COOL } = F;

export const PRINT = F.PRINT77;
export default async (T, R) => {
  const a = B.anchorsB2(T);
  return [{ t: R.a, draw: scene(a, T, R), print: PRINT }];
};

// ------------------------------------------------------------------------------------------------ layout (world px of the act after the board)
const FUR = [520, 560];                                       // the furnace
const PG = { cx: 1380, cy: 470, w: 640, h: 460 };              // the page
const PGX = PG.cx - PG.w / 2, PGY = PG.cy - PG.h / 2;
const TAG = { x: PGX + PG.w + 20, y: PGY + 70, w: 250, h: 92 };
const CARD1 = { x: 1800, y: 250, w: 540, h: 300 };             // the OpenAI card
const CARD2 = { x: 1800, y: 205, w: 800, h: 250 };             // the Gowers card
const NINE = Array.from({ length: 9 }, (_, i) => PG.cx + (i - 4) * 78);
const NG = 860;                                                // the nine stand on this line
const WX = 2800, WY = 200, CW = 56, CHh = 38, SX = 64, SY = 46, COLS = 24, NE = 353;   // the Erdős block (unit chart, 353 cards)
const OX = WX + COLS * SX + 100, OCOLS = 41, ON = 492;                                  // the OEIS block (44 of 492 solved)
const ER9 = (() => { const r = prng(909), out = new Set(); while (out.size < 9) { const c = 10 + Math.floor(r() * 14), rr = 3 + Math.floor(r() * 10); out.add(rr * COLS + c); } return [...out].sort((p, q) => p - q); })();
const OE44 = (() => { const r = prng(4492), out = new Set(); while (out.size < 44) { const c = Math.floor(r() * 16), rr = Math.floor(r() * 12); out.add(rr * OCOLS + c); } return out; })();
const TWO = [ER9[2], ER9[6]];                                  // the two that waited since 1970
const cardXY = (i, oe = false) => (oe ? [OX + (i % OCOLS) * SX, WY + 15 + Math.floor(i / OCOLS) * SY] : [WX + (i % COLS) * SX, WY + Math.floor(i / COLS) * SY]);

function scene(a, T, R) {
  const tH = a.matter - .1;                                     // the grain leaves the board
  const cb = B.camBoard(tH, a), [gx0, gy0] = B.grainAt(B.BOARD_MID.x, B.BOARD_MID.y, B.BOARD_MID.s), G0 = F.lookPt(cb.cx, cb.cy, cb.z, gx0, gy0), R0 = 6.5 * B.BOARD_MID.s * cb.z;
  const tFur = a.matter + .75;                                  // the grain sits in the furnace
  const K = [
    [a.matter - .2, 960, 540, 1], [a.math + .5, 980, 545, 1.02], [a.watch + .6, 1040, 545, 1.04], [a.dots - .1, 1060, 545, 1.04],
    [a.dots + 1.1, 1700, 520, 1], [a.outside - .1, 1720, 525, 1.01], [a.outside + 1.2, 1700, 560, .9], [a.one - .05, 1710, 560, .9],
    [a.one + 1.1, 1960, 470, .94], [a.dm - .1, 1990, 470, .95], [a.dm + 1.6, 4180, 560, 1.02], [a.two - .1, 4170, 560, 1.03], [a.cost - .1, 4160, 560, 1.035],
    [a.cost + 1.0, WX + 17 * SX, 610, 1.42], [a.cracked - .05, WX + 17 * SX, 612, 1.44], [a.cracked + 1.0, WX + COLS * SX / 2, 590, 1], [a.fall - .2, 3568, 590, 1],
  ];
  const cam = (t) => (t < a.fall - .2 ? F.lookPath(t, K) : B.camStacks(t, a));
  const glowAt = (t) => { const b = B.boardGlow(t), w = [1100, 470, 1000, .5]; const k = smooth(span(t, a.matter - .3, a.matter + 1)); return b.map((v, i) => lerp(v, w[i], k)); };
  const io = (t, i0, o0, d = .45) => span(t, i0, i0 + .55) * (1 - span(t, o0, o0 + d));

  // ---------------------------------------------------------------- 4.02 the furnace (the grain flies into it) · 4.03–4.05 the page
  const drawFurnace = (ctx, t) => {
    if (t < tH || t > a.dots + 2.5) return null;
    return B.furnace(ctx, t, FUR[0], FUR[1], { u: span(t, a.matter + .4, a.matter + 1.2), fire: .55 + .4 * span(t, a.matter + .5, a.slow + .6), grow: span(t, tFur, tFur + 9) * .5, r0: 12, dial: -Math.PI / 2 + (t - a.matter) * .22 });
  };
  const pageGrow = (t) => span(t, a.math + .1, a.math + 1.1);
  const wr = (t) => (i) => [span(t, a.watch + .15 + i * .2, a.watch + .45 + i * .2), span(t, a.dots - .15 + (11 - i) * .03, a.dots + .25 + (11 - i) * .03)];
  const drawPage = (ctx, t) => {
    if (t < a.math) return null;
    const g = pageGrow(t);
    const out = F.dotSheet(ctx, t, PGX, PGY, PG.w, PG.h, { grow: g, h0: 8, dots: span(t, a.dots + .1, a.dots + .9), pairs: span(t, a.page - .1, a.page + 1.2), line: span(t, a.page + .3, a.page + 1), text: null });
    if (g >= 1) { ctx.save(); ctx.beginPath(); ctx.roundRect(PGX, PGY, PG.w, PG.h, 10); ctx.clip(); B.writing(ctx, PGX + 40, PGY + 10, PG.w - 80, PG.h - 30, wr(t)); ctx.restore(); }
    return out;
  };
  // the tag (4.06) → the OpenAI card (4.07) → the Gowers card (4.09): one paper object
  const tagK = (t) => span(t, a.spec - .1, a.spec + .6);
  const m1 = (t) => quartIO(span(t, a.maker - .1, a.maker + .75)), m2 = (t) => quartIO(span(t, a.one - .2, a.one + .7));
  const paperRect = (t) => {
    const sw = .05 * Math.sin(t * 1.7) * (1 - m1(t)), k1 = m1(t), k2 = m2(t);
    let r = { x: lerp(TAG.x, CARD1.x, k1), y: lerp(TAG.y, CARD1.y, k1), w: lerp(TAG.w, CARD1.w, k1), h: lerp(TAG.h, CARD1.h, k1) };
    r = { x: lerp(r.x, CARD2.x, k2), y: lerp(r.y, CARD2.y, k2), w: lerp(r.w, CARD2.w, k2), h: lerp(r.h, CARD2.h, k2) };
    return { ...r, rot: sw + lerp(.04, -.006, k1) };
  };
  const drawPaper = (ctx, t) => {
    const u = tagK(t); if (u <= 0 || t > a.dm + 2.4) return;
    const r = paperRect(t), k1 = m1(t), k2 = m2(t);
    // the string from the page's corner (it slackens as the tag opens into the card)
    const str = 1 - smooth(span(t, a.maker, a.maker + .5)); if (str > 0) F.outline(ctx, [[[PGX + PG.w - 8, PGY + 8], [r.x + 18, r.y + 12]]], smooth(span(u, 0, .4)), { w: 1.6, a: str });
    const unf = expoOut(span(u, .2, 1));
    ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.rot);
    // the turn (4.07): the tag flips about its vertical axis while it grows
    const flip = Math.abs(Math.cos(Math.PI * span(t, a.maker - .1, a.maker + .45)));
    const ww = r.w * Math.max(.04, flip) * unf, x0 = (r.w - ww) / 2;
    ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(x0 + 8, 12, ww, r.h, 6); ctx.fill();
    ctx.fillStyle = F.lin(ctx, 0, 0, r.w, r.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(x0, 0, ww, r.h, 6); ctx.fill();
    ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke();
    if (k1 < .02) { ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(18, 12, 5, 0, 6.29); ctx.fill(); }
    ctx.restore();
    const ink = { serif: false, weight: 700, col: PAPER.ink, glow: false };
    // tag text
    { const tu = span(u, .5, 1) * (1 - span(t, a.maker - .2, a.maker)); if (tu > 0) { F.maskLine(ctx, [['NOT A MATH', 0]], r.x + 30, r.y + 40, 24, F.rise(tu), ink); F.maskLine(ctx, [['SPECIALIST', 0]], r.x + 30, r.y + 72, 24, F.rise(span(tu, .15, 1)), ink); } }
    // the OpenAI card
    { const cu = span(t, a.maker + .45, a.maker + 1.1) * (1 - span(t, a.one - .45, a.one - .15)); if (cu > 0) {
      F.maskLine(ctx, [['OPENAI · 20 MAY 2026', 0]], r.x + 36, r.y + 56, 22, F.rise(cu), { ...ink, col: PAPER.faint });
      F.maskLine(ctx, [['“general-purpose', 0]], r.x + 36, r.y + 128, 50, F.rise(span(cu, .1, 1)), { serif: true, col: mixHex(PAPER.ink, GOLD.deep, .85 * span(t, a.general, a.general + .4)), glow: false });
      F.maskLine(ctx, [['reasoning model”', 0]], r.x + 36, r.y + 186, 50, F.rise(span(cu, .2, 1)), { serif: true, col: mixHex(PAPER.ink, GOLD.deep, .85 * span(t, a.general + .2, a.general + .6)), glow: false });
      F.maskLine(ctx, [['ERDŐS PROBLEM #90', 0]], r.x + 36, r.y + 256, 22, F.rise(span(cu, .3, 1)), ink); } }
    // the Gowers card: “… I would have recommended / acceptance without any hesitation.”; the spoken words warm to gold ink
    { const gu = span(t, a.one + .35, a.one + 1.0) * (1 - span(t, a.dm + .9, a.dm + 1.3)); if (gu > 0) {
      const ws = F.wordTimes(T, 'without any hesitation', null, a.one) ?? [a.without, a.without + .4, a.without + .8];
      F.maskLine(ctx, [['“… I would have recommended', 0]], r.x + 44, r.y + 92, 54, F.rise(gu), { serif: true, col: PAPER.ink, glow: false });
      let xx = r.x + 44; const y2 = r.y + 92 + 66;
      [['acceptance ', -1], ['without ', 0], ['any ', 1], ['hesitation.”', 2]].forEach(([s, k]) => { const g = k < 0 ? 0 : span(t, ws[k] - .05, ws[k] + .3); F.maskLine(ctx, [[s, 0]], xx, y2, 54, F.rise(span(gu, .12, 1)), { serif: true, col: mixHex(PAPER.ink, GOLD.deep, .9 * g), glow: false }); xx += F.measure(s, 54, true) + (s.endsWith(' ') ? 54 * .26 : 0); });
      const [cx, cy] = [r.x + 4, r.y + r.h + 40];
      F.capsLabel(ctx, 'TIMOTHY GOWERS · MAY 2026', cx, cy, span(gu, .3, 1), { size: 24, col: CREAM, align: 'left' });
      F.capsLabel(ctx, 'ON A HYPOTHETICAL SUBMISSION TO THE ANNALS OF MATHEMATICS', cx, cy + 34, span(gu, .4, 1), { size: 22, align: 'left' });
      F.capsLabel(ctx, 'COMMENTARY REQUESTED BY OPENAI · ARXIV 2605.20695', cx, cy + 66, span(gu, .5, 1), { size: 22, align: 'left' }); } }
  };
  // ---------------------------------------------------------------- 4.08 the nine outside mathematicians
  const drawNine = (ctx, t) => {
    if (t < a.outside - .3 || t > a.dm + 2.5) return;
    const gu = smooth(span(t, a.outside - .2, a.outside + .6)); if (gu > 0) { ctx.fillStyle = rgba(P.blue1, .6); ctx.fillRect(PG.cx - 420 * gu, NG - 1, 840 * gu, 2); }
    NINE.forEach((x, i) => {
      const d = Math.abs(i - 4) / 4, k = expoOut(span(t, a.outside + d * .5, a.outside + .7 + d * .5)); if (k <= 0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(x - 70, NG - 200, 140, 201); ctx.clip();
      F.person(ctx, x, NG + (1 - k) * 150, 104, { dir: i < 4 ? 1 : -1, look: .5, light: .45 }); ctx.restore();
      const tk = span(t, a.checked - .25 + i * .11, a.checked + .1 + i * .11); if (tk > 0) F.goldSpan(ctx, [[x - 10, NG - 128], [x - 2, NG - 120], [x + 12, NG - 138]], 0, smooth(tk), { w: 2.2 });
    });
    // 4.09 → 4.10 a gold thread from the last tick along to the right (into the wall)
    const th = span(t, a.dm - .25, a.dm + 1.5); if (th > 0) F.goldSpan(ctx, [[NINE[8] + 14, NG - 138], [2400, 700], [WX + 6 * SX, WY + 9 * SY]], span(t, a.dm + 1.4, a.dm + 2.2), smooth(th), { w: 1.8 });
  };
  // ---------------------------------------------------------------- 4.10–4.13 the wall of open problems
  const solvedE = (i, t) => { const k = ER9.indexOf(i); if (k < 0) return 0; const t1 = a.solved + .1 + k * .32; return span(t, t1, t1 + .35); };
  const drawWall = (ctx, t) => {
    if (t < a.dm - .2 || t > a.fall + 2) return;
    const dimE = 1 - .5 * span(t, a.cost + .2, a.cost + .9), slide = expoIn(span(t, a.cost - .15, a.cost + .85)) * 3200;
    // the OEIS block (44 of 492 solved): it slides out of the picture before the cost line
    if (slide < 3100) for (let i = 0; i < ON; i++) {
      const [x, y] = cardXY(i, true), col = i % OCOLS; const k = span(t, a.dm + .1 + col * .04, a.dm + .5 + col * .04); if (k <= 0) continue;
      const s = OE44.has(i) ? span(t, a.solved + .2 + (col / 16) * 2.6 + (i % 5) * .05, a.solved + .5 + (col / 16) * 2.6 + (i % 5) * .05) : 0;
      B.indexCard(ctx, t, x + slide, y, CW, CHh, { u: k, solved: s, glow: s * .5 });
    }
    // the Erdős block (353): it draws in column by column; the nine flip to SOLVED; two come forward (4.11); coins (4.12)
    for (let i = 0; i < NE; i++) {
      if (TWO.includes(i) && t > a.two - .1 && t < a.cost + .4) continue;
      const [x, y] = cardXY(i), col = i % COLS, k = span(t, a.dm - .1 + col * .035, a.dm + .3 + col * .035); if (k <= 0) continue;
      const s = solvedE(i, t); B.indexCard(ctx, t, x, y, CW, CHh, { u: k, solved: s, glow: s, dim: s > .5 ? 1 : dimE });
    }
    // coins under the nine
    ER9.forEach((i, k) => { const u = expoOut(span(t, a.dollars - .25 + k * .07, a.dollars + .2 + k * .07)) * (1 - span(t, a.fall - .3, a.fall + .1)); if (u <= 0) return; const [x, y] = cardXY(i), cx = x + CW / 2, cy = y + CHh + 2;
      F.halo(ctx, cx, cy, 26, .6 * u, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.arc(cx, cy, 10 * u, 0, 6.29); ctx.fill(); ctx.strokeStyle = GOLD.deep; ctx.lineWidth = 1.5; ctx.stroke(); });
  };
  // 4.11 the two that waited since 1970 (screen space: they lift off the wall toward the camera and go back)
  const drawTwo = (ctx, t, sp) => {
    if (t < a.two - .1 || t > a.cost + .4) return;
    const up = quartIO(span(t, a.two - .1, a.two + .7)), back = quartIO(span(t, a.cost - .45, a.cost + .35)), k = up * (1 - back);
    TWO.forEach((i, j) => {
      const [x, y] = cardXY(i), [sx, sy] = sp(x, y), z = cam(t).z, w0 = CW * z, h0 = CHh * z, w1 = 250, h1 = 170, tx = W / 2 - 290 + j * 330, ty = 360;
      const X = lerp(sx, tx, k), Y = lerp(sy, ty, k), w = lerp(w0, w1, k), h = lerp(h0, h1, k);
      F.halo(ctx, X + w / 2, Y + h / 2, w * 1.1, .4, GOLD.halo, GOLD.core);
      ctx.save(); ctx.translate(X, Y); ctx.scale(w / CW, h / CHh); B.indexCard(ctx, t, 0, 0, CW, CHh, { solved: 1 }); ctx.restore();
      const lu = span(t, a.two + .5, a.two + 1) * (1 - span(t, a.cost - .6, a.cost - .3)); if (lu > 0) F.capsLabel(ctx, 'OPEN SINCE 1970', X + w / 2, Y + h + 46, lu, { size: 26, col: CREAM });
    });
    const lu = span(t, a.half - .1, a.half + .4) * (1 - span(t, a.cost - .6, a.cost - .3)); if (lu > 0) F.verdict(ctx, t, W / 2, 680, '56 YEARS', lu, { size: 40 });
  };

  // ======================================================================================================================== draw
  const whyWs = F.wordTimes(T, 'Why still small', null, a.whyS - .1);
  const whyQ = (ctx, t) => { if (whyWs && t > a.whyS - .3 && t < a.matter + .4) F.question(ctx, t, 'Why still small?', 500, 330, 64, { ts: whyWs, out: span(t, a.matter - .1, a.matter + .3) }); };
  return (ctx, t) => {
    if (t < tH) { F.night(ctx, t, { glow: B.boardGlow(t), ox: B.STARS_B[0], oy: B.STARS_B[1] }); B.boardAct(ctx, t, a); whyQ(ctx, t); return; }
    const c = cam(t), sp = (x, y) => F.lookPt(c.cx, c.cy, c.z, x, y);
    F.night(ctx, t, { glow: glowAt(t), ox: B.STARS_B[0] - (c.cx - 960) * .02, oy: B.STARS_B[1] - (c.cy - 540) * .03 });
    // the board drops away under its own camera (its grain has left as the carrier)
    if (t < a.matter + 3.5) B.boardAct(ctx, t, a, { st: { grain: 0 } });
    let fur = null;
    F.look(ctx, c.cx, c.cy, c.z, () => {
      fur = drawFurnace(ctx, t);
      drawPage(ctx, t);
      drawNine(ctx, t);
      drawWall(ctx, t);
      B.stacksAct(ctx, t, a);
      drawPaper(ctx, t);
    });
    // ---------------- the grain: from row 2 into the furnace (screen space while it flies), then it is the furnace's pellet
    if (fur) {
      const q = sineIO(span(t, tH, tFur)), [px, py, pr] = fur.pel, [tx, ty] = sp(px, py), cx1 = lerp(G0[0], tx, .5), cy1 = Math.min(G0[1], ty) - 220;
      const x = (1 - q) ** 2 * G0[0] + 2 * (1 - q) * q * cx1 + q * q * tx, y = (1 - q) ** 2 * G0[1] + 2 * (1 - q) * q * cy1 + q * q * ty, r = lerp(R0, pr * c.z, q);
      F.halo(ctx, x, y, r * 4, .75, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
    }
    drawTwo(ctx, t, sp);
    // ---------------- the mini board (4.04: DISCOVERY pulses), corner icon
    { const u = span(t, a.watch - .1, a.watch + .7) * (1 - span(t, a.dots + .2, a.dots + .9)); if (u > 0) B.fourLines(ctx, t, B.BOARD_CORNER.x, B.BOARD_CORNER.y, B.BOARD_CORNER.s, { m: 1, grain: 1, tick: 1, u, dPulse: .9 * Math.max(0, Math.sin((t - a.full) * 5)) * span(t, a.full - .4, a.full) * (1 - span(t, a.dots - .5, a.dots)) }); }
    // ---------------- screen type
    whyQ(ctx, t);
    { const [x, y] = sp(FUR[0], FUR[1] + 230); F.capsLabel(ctx, 'MATTER IS SLOW', x, y, io(t, a.slow - .2, a.dots + .1), { size: 30, col: CREAM }); }
    { const [x, y] = sp(PG.cx, PGY + PG.h + 62); F.capsLabel(ctx, 'NOTHING TO BUILD', x, y, io(t, a.nothing, a.watch + .2), { size: 30, col: CREAM }); const u = io(t, a.full - .05, a.dots - .1); if (u > 0) F.verdict(ctx, t, x, y + 6, 'FULL SPEED', u, { size: 36 }); }
    { const [x, y] = sp(PG.cx, PGY - 40); F.capsLabel(ctx, '9 OUTSIDE MATHEMATICIANS', x, y, io(t, a.outside + .3, a.dm - .2), { size: 28, col: CREAM }); }
    { const u = io(t, a.dm + .7, a.two - .2); F.capsLabel(ctx, 'ALPHAPROOF NEXUS · GOOGLE DEEPMIND', W / 2, 70, u, { size: 30, col: GOLD.text }); F.capsLabel(ctx, 'EVERY PROOF MACHINE-CHECKED · PREPRINT, MAY 2026', W / 2, 108, span(u, .2, 1) * u, { size: 22, col: CREAM }); }
    { const u = io(t, a.dollars - .05, a.cracked - .25); if (u > 0) { ctx.save(); ctx.fillStyle = F.lin(ctx, 0, 0, 0, 170, [[0, rgba(P.night0, .85)], [1, rgba(P.night0, 0)]]); ctx.globalAlpha = u; ctx.fillRect(0, 0, W, 170); ctx.restore(); }
      F.verdict(ctx, t, W / 2, 66, 'A FEW HUNDRED DOLLARS PER SOLVED PROBLEM', u, { size: 32 }); F.capsLabel(ctx, '9 SOLVED ERDŐS PROBLEMS', W / 2, 118, io(t, a.cost + .5, a.cracked - .25), { size: 24, col: CREAM }); }
    { const u = io(t, a.share - .2, a.fall + .3); if (u > 0) { F.capsLabel(ctx, '9 OF 353 ERDŐS PROBLEMS', W / 2, 86, u, { size: 34, col: CREAM }); } }
    { const u = io(t, a.cant - .1, a.c09 - .5); if (u > 0) F.capsLabel(ctx, 'NOT YET CHECKED', W / 2, 150, u, { size: 32, col: CREAM }); }
  };
}
