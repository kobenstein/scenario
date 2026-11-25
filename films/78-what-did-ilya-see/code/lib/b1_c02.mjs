// Film 78 · B1 · c02 'So what was in those pages' → 'Then it fell apart' (59.3–88.9 s). Rows 1.01–1.08 (docs/shots.md):
//   1.01 out of plateHook: push into the pile, the top page lifts and turns toward us, big in the frame (MEMO · 52 PAGES)
//   1.02 the man-print on the page gets its name line SAM ALTMAN · CEO, OPENAI (text + plain silhouette, no photo, no quote)
//   1.03 THE CLAIM: the page drops away, the print stands up as a silhouette; five people around him, the threads flicker and break
//   1.04 the broken threads fly into a folder as screenshot cards while 12 months light up: ABOUT A YEAR
//   1.05 a court transcript rises out of the folder: "the company would be destroyed" · UNDER OATH · OAKLAND, MAY 2026
//   1.06 the page sinks back; every card pulls a thread to ONE small figure: ONE COLLEAGUE (no name)
//   1.07 the people involved stand grey beside it; dashed lines that never reach them: NOT CHECKED WITH THEM
//   1.08 the call grid hurries in (speed lines), the boss slot empty: "the process was rushed." · SWORN TESTIMONY, OCT 2025
import * as E from './f10_editorial.mjs';
import * as F from './f78_kit.mjs';
import * as S from './f78_world.mjs';
import * as B from './b1_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, prng } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL, mv, land, rise } = F;
const TAU = Math.PI * 2;
const lerpR = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });

// the call grid used at the end of c02 and through c03 (exported for c03)
export const GRID = { x: 250, y: 190, w: 860, h: 520 };
export function gridTile(R, i) { const gap = 12, ch = 48, tw = (R.w - gap * 4) / 3, th = (R.h - ch - gap * 3) / 2, c = i % 3, r = Math.floor(i / 3); return { x: R.x + gap + c * (tw + gap), y: R.y + ch + gap + r * (th + gap), w: tw, h: th }; }
export const TILES = [{ kind: 'person' }, { kind: 'ilya', label: 'ILYA SUTSKEVER', sub: 'CHIEF SCIENTIST' }, { kind: 'person' }, { kind: 'boss', label: 'THE BOSS', sub: 'HEAD OF OPENAI' }, { kind: 'person' }, { kind: 'person' }];

export default function c02({ T, T0, G, GE }) {
  const tPages = G('those pages', 0, T0), tAbout = G('They were about that boss'), tSam = G('Sam Altman');
  const tClaim = G('Their claim'), tStraight = G('straight with'), tAround = G('around him');
  const tColl = G('Ilya had collected'), tYear = G('about a year');
  const tOath = G('Under oath, he explained'), tIf = G('if he did nothing'), tDest = G('the company would be destroyed');
  const tSingle = G('But almost all of it'), tColleague = G('single colleague');
  const tCheck = G('He did not check it'), tInv = G('people involved');
  const tBoard = G('And the board that fired'), tFast = G('moved too fast'), tRushed = G('the process was rushed');
  const tEnd = G('Then it fell apart');
  const qDest = B.words(T.GW('the company would be destroyed', null, tDest - .1).slice(0, 5));
  const qDestShow = (() => { const q = qDest.map((w) => ({ ...w, w: w.w.replace(/[.,]+$/, '') })); q[0].w = '“' + q[0].w; q[4].w += '”'; return q; })();
  const qRush = B.words(T.GW('the process was rushed', null, tRushed - .1).slice(0, 4));

  const HP = S.HOOK.pages, HL = S.HOOK.lectern, LN = S.HOOK.line;
  const BIG = { x: 690, y: 92, w: 540, h: 690 };                 // the lifted top page (1.01–1.02)
  const MEMO = { x: 330, y: 1180, w: 330, h: 420 };              // the page drops away (down out of the frame, bottom left)
  const FL = 860, GR0 = 700;                                                // the floor of the claim / colleague pictures
  const CEN = { x: 960, h: 440 };                                // the boss silhouette (1.03)
  const RING = [[300, 860, 280], [570, 775, 235], [775, 728, 190], [1350, 775, 235], [1620, 860, 280]];
  const FOLD = { x: 760, y: 330, w: 400, h: 300 };               // the folder (1.04)
  const FOLD2 = { x: 250, y: 420, w: 360, h: 270 };              // the folder, moved left (1.06–1.07)
  const TR = { x: 610, y: 60, w: 700, h: 780 };                  // the transcript (1.05)
  const COL = { x: 1060, h: 400 };                               // ONE COLLEAGUE
  const INV = [[1450, 330], [1620, 300], [1790, 320]];           // the people involved (grey)
  const QC = { x: 1150, y: 330, w: 700 };                        // the "rushed" quote card

  const keys = [
    [tPages + .45, { x: 700, y: 470, s: 1.16 }], [tAbout + .2, { x: 960, y: 455, s: 1.1 }], [tClaim - .1, { x: 960, y: 470, s: 1.07 }],
    [tClaim + 1.9, { x: 960, y: 540, s: 1 }], [tColl + .1, { x: 960, y: 540, s: 1.01 }], [tOath + .3, { x: 960, y: 470, s: 1.07 }],
    [tSingle - .1, { x: 960, y: 460, s: 1.09 }], [tSingle + 1.7, { x: 960, y: 540, s: 1 }], [tCheck + .6, { x: 1010, y: 540, s: 1.02 }],
    [tBoard + .2, { x: 980, y: 540, s: 1 }], [tRushed + .3, { x: 980, y: 520, s: 1.035 }],
  ];

  // seeded card flights (1.04): each card starts at a thread's broken middle and drops into the folder
  const rnd = prng(102), CARDS = [];
  for (let i = 0; i < 12; i++) { const r = RING[i % 5]; CARDS.push({ sx: lerp(CEN.x, r[0], .5), sy: lerp(560, r[1] - r[2] * .6, .5) - 20, born: tColl + .1 + i * ((tOath - .5 - tColl) / 12), dx: (rnd() - .5) * FOLD.w * .62, rot: (rnd() - .5) * .3 }); }

  const draw = (ctx, t, cam) => {
    if (t < T0 || t > tEnd + 3) return;
    // ============================================================== 1.01–1.02 · the pile, the lifted page, the name
    const lift = mv(t, T0 + .45, 1.85);                                   // the top page lifts off and comes forward
    const drop = mv(t, tClaim - .15, 1.6);                                // 1.03: the page drops away to the memo spot
    if (t < tClaim + 2) {
      // the rest of the pile slides down-left out of the frame (it stays the evidence: it comes back as the folder's content)
      const pOut = mv(t, tPages + .1, 2.0);
      if (pOut < 1) {
        ctx.save(); ctx.translate(-260 * pOut, 820 * pOut * pOut);
        F.pages(ctx, t, HP, { n: 51, lines: 1, count: 1 - span(pOut, 0, .3), dark: .25 * pOut });
        ctx.restore();
      }
      // the line retracts upward, the lectern sinks behind its floor
      const lnU = 1 - mv(t, T0 + .55, 1.2);
      if (lnU > 0) F.divider(ctx, t, LN.x, LN.y0, LN.y1, lnU, { glow: lnU });
      const lr = 1 - mv(t, T0 + .6, 1.3);
      if (lr > 0) { ctx.fillStyle = rgba(GOLD.line, .18 * lr); ctx.fillRect(HL.x - 260 * lr, HL.y, 520 * lr, 3); F.lectern(ctx, t, HL.x, HL.y, HL.h, { rise: lr, spot: lr, rings: .8 * lr }); }
      // the page: from the pile's top page to BIG (a turn toward us on the way: narrows, tilts, then opens), then drops to MEMO
      let R = lerpR(HP, BIG, lift);
      if (drop > 0) R = lerpR(BIG, MEMO, drop);
      const turn = Math.sin(Math.PI * lift) * .35, sx = 1 - turn * .5;
      ctx.save(); ctx.translate(R.x + R.w / 2, R.y + R.h / 2); ctx.rotate(-.015 + .06 * Math.sin(Math.PI * lift) - .12 * Math.sin(Math.PI * drop)); ctx.scale(sx, 1); ctx.translate(-R.w / 2, -R.h / 2);
      if (lift > .02) halo(ctx, R.w / 2, R.h * .45, R.w * 1.1, .12 * (1 - drop), GOLD.halo, GOLD.hot);
      // the man-print stands up out of the page in 1.03: on the page it empties as it rises
      F.pages(ctx, t, { x: 0, y: 0, w: R.w, h: R.h }, { n: 0, by: 1, profile: 1 - span(drop, .05, .5), about: 1 - span(drop, 0, .25), lines: 1, tilt: 0 });
      ctx.restore();
      // MEMO · 52 PAGES over the page, SAM ALTMAN · CEO, OPENAI pinned to the print
      const mu = span(t, T0 + 1.3, T0 + 2.1) * (1 - span(t, tClaim - .3, tClaim + .1));
      if (mu > 0) F.dateTag(ctx, BIG.x, BIG.y - 30, 'MEMO · 52 PAGES', mu, { size: 26 });
      const nu = span(t, tSam - .15, tSam + .7) * (1 - span(t, tClaim - .25, tClaim + .25));
      if (nu > 0) { const k = BIG.w * .2; F.goldLabel(ctx, BIG.x + BIG.w * .5 + k * .4, BIG.y + BIG.h * .5 - k * .55, 'SAM ALTMAN', 'CEO, OPENAI', nu, { dx: 360, dy: -120, size: 40 }); }
    }
    // ============================================================== 1.03 · THE CLAIM
    const claimIn = mv(t, tClaim - .05, 1.5), claimOut = mv(t, tColl - .2, 1.5);
    if (claimIn > 0 && claimOut < 1) {
      const sink = (d) => expoIn(clamp(claimOut * 1.4 - d));
      B.ground(ctx, GR0, claimIn * (1 - claimOut));
      // the five people around him: rise one after another, slightly after him
      RING.forEach(([x, y, h], i) => B.figure(ctx, t, x, y, h, { u: clamp((claimIn - .25 - i * .06) * 2), sink: sink(.15 + i * .05), glow: .22, fig: { look: .35, dir: x < CEN.x ? 1 : -1 } }));
      // the threads from him to them: draw out, flicker on "straight", snap one after another on "around him"
      RING.forEach(([x, y, h], i) => {
        const u = span(t, tClaim + .5 + i * .12, tClaim + 1.3 + i * .12) * (1 - span(claimOut, 0, .3));
        const brk = mv(t, tAround - .1 + i * .11, .45), fl = span(t, tStraight - .2, tStraight + .2) * (1 - brk);
        B.thread(ctx, t, [CEN.x + (x < CEN.x ? -55 : 55), FL - CEN.h * .62], [x, y - h * .62], u, { brk, flicker: fl, a: .9, w: 3 });
      });
      // he rises out of the print (the plain silhouette: no face, no photo), under a cool top light
      B.figure(ctx, t, CEN.x, FL, CEN.h, { u: clamp(claimIn * 1.3), sink: sink(0), top: .9, topCol: COOL, glow: .3, fig: { look: .2, back: .35, rim: mixHex(P.blue0, P.cream, .8) } });
      ctx.restore();
      const cap = rise(span(t, tClaim, tClaim + .7)) * (1 - expoIn(span(t, tColl - .3, tColl + .3)));
      B.caps(ctx, 'THE CLAIM', W / 2, 150, 26, cap, { align: 'center', g: 1 });
      B.caps(ctx, 'NOT STRAIGHT WITH THE PEOPLE AROUND HIM', W / 2, 215, 40, rise(span(t, tStraight - .3, tStraight + .5)) * (1 - expoIn(span(t, tColl - .3, tColl + .3))), { align: 'center' });
    }
    // ============================================================== 1.04 · the folder fills, 12 months: ABOUT A YEAR
    const fIn = mv(t, tColl - .1, 1.2);                                   // the folder rises
    const fMove = mv(t, tSingle - .1, 1.6);                               // 1.06: the folder moves left
    const trUp = mv(t, tOath - .2, 1.6), trDown = mv(t, tSingle - .2, 1.3);   // 1.05: the transcript rises out of it, sinks back
    const fOut = mv(t, tBoard - .2, 1.4);                                 // 1.08: the folder sinks away
    if (fIn > 0 && fOut < 1) {
      const FR = lerpR(FOLD, FOLD2, fMove), big = trUp * (1 - trDown), fDY = 430 * big;
      const sinkY = 700 * expoIn(fOut), up = (1 - fIn) * 800, oy = sinkY + up + fDY, yFront = FR.y + FR.h * .38;
      ctx.save(); ctx.translate(0, oy);
      // the back of the folder, then the cards in it, then the transcript (1.05) rising out of it, then the front
      ctx.fillStyle = mixHex(GOLD.deep, P.night1, .55); ctx.beginPath(); ctx.moveTo(FR.x, FR.y + 26); ctx.lineTo(FR.x + FR.w * .3, FR.y + 26); ctx.lineTo(FR.x + FR.w * .36, FR.y); ctx.lineTo(FR.x + FR.w, FR.y); ctx.lineTo(FR.x + FR.w, FR.y + FR.h); ctx.lineTo(FR.x, FR.y + FR.h); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.line, .6); ctx.lineWidth = 2; ctx.stroke();
      // cards (born in flight from the broken threads; inside they stand up out of the folder)
      const pulled = mv(t, tSingle + .5, 1.6);                           // 1.06: they lift a little when the threads go out
      CARDS.forEach((C, i) => {
        const b = span(t, C.born, C.born + .9); if (b <= 0) return;
        const k = sineIO(b), inX = FR.x + FR.w / 2 + C.dx * (FR.w / FOLD.w), inY = FR.y + 30 - 30 * pulled - (i % 3) * 6;
        const x = lerp(C.sx, inX, k), y = lerp(C.sy - oy, inY, k) - Math.sin(Math.PI * k) * 120;
        B.shot(ctx, x, y, lerp(70, 64, k) * (FR.w / FOLD.w), { rot: C.rot * (1 - k * .6) });
      });
      ctx.restore();
      // the transcript rises out of the folder (clipped above the folder's front edge while it is still in it)
      if (big > 0) {
        const R0 = { x: FR.x + 30, y: FR.y + FR.h * .42 + oy, w: FR.w - 60, h: FR.h * .9 }, R = lerpR(R0, TR, big);
        ctx.save(); ctx.beginPath(); ctx.rect(-600, -2000, W + 1200, yFront + oy + 2000); ctx.clip();
        F.transcript(ctx, t, R, { paper: 1, head: 0, write: 1, hand: 0 });
        if (big > .6) {   // the quote on the page: a lit band, the words turn gold as he says them
          const s = R.w / TR.w, by = R.y + R.h * .5, a = span(big, .6, 1);
          ctx.save(); ctx.globalAlpha *= a;
          ctx.fillStyle = PAPER.lit; ctx.fillRect(R.x + 40 * s, by - 70 * s, R.w - 80 * s, 120 * s);
          ctx.fillStyle = rgba(GOLD.halo, .35); ctx.fillRect(R.x + 40 * s, by + 38 * s, (R.w - 80 * s) * sineIO(span(t, tDest, tDest + 1.2)), 6 * s);
          ctx.translate(R.x + R.w / 2, by + 14 * s); ctx.scale(s, s);
          B.spokenQuote(ctx, t, qDestShow, 0, 0, 46, span(t, tIf - .2, tIf + .6), { align: 'center', ink: GOLD.deep, maxW: 640 });
          ctx.restore();
        }
        ctx.restore();
      }
      // the front of the folder
      ctx.save(); ctx.translate(0, oy);
      ctx.fillStyle = mixHex(GOLD.deep, P.night1, .3); ctx.beginPath(); ctx.roundRect(FR.x - 4, yFront, FR.w + 8, FR.h * .62, 10); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.line, .75); ctx.lineWidth = 2; ctx.stroke();
      F.goldText(ctx, [['EVIDENCE', .5]], FR.x + 24, yFront + 44, 22, rise(span(fIn, .5, 1)), { serif: false, weight: 700, spacing: .12 });
      ctx.restore();
    }
    // the months strip (1.04): 12 cells under the folder, lit one by one as the cards land; ABOUT A YEAR
    const mIn = mv(t, tColl + .1, 1.0), mOut = mv(t, tOath - .3, 1.1);
    if (mIn > 0 && mOut < 1) {
      const x0 = 560, cw = 66, y = 730 + 300 * expoIn(mOut) + (1 - expoOut(mIn)) * 200;
      for (let i = 0; i < 12; i++) {
        const lit = span(t, CARDS[i].born + .6, CARDS[i].born + .9);
        ctx.fillStyle = mixHex(mixHex(P.night1, P.ind1, .6), GOLD.body, lit * .85); ctx.beginPath(); ctx.roundRect(x0 + i * cw, y, cw - 8, 34, 6); ctx.fill();
        ctx.strokeStyle = rgba(lit > 0 ? GOLD.line : CREAM2, .6); ctx.lineWidth = 1.5; ctx.stroke();
        if (lit > 0) halo(ctx, x0 + i * cw + cw / 2 - 4, y + 17, 50, .25 * lit, GOLD.halo, GOLD.core);
      }
      B.caps(ctx, 'ABOUT A YEAR', 960, y + 90, 36, span(t, tYear - .2, tYear + .5), { align: 'center', g: 1 });
      B.caps(ctx, '12 MONTHS OF SCREENSHOTS', 960, y - 26, 22, span(t, tColl + .5, tColl + 1.2), { align: 'center', col: CREAM2 });
    }
    // UNDER OATH · OAKLAND, MAY 2026 (1.05)
    const oU = span(t, tOath - .1, tOath + .7) * (1 - span(t, tSingle - .4, tSingle + .1));
    if (oU > 0) F.dateTag(ctx, TR.x, TR.y - 4, 'UNDER OATH · OAKLAND, MAY 2026', oU, { size: 26 });
    // ============================================================== 1.06–1.07 · ONE COLLEAGUE, NOT CHECKED WITH THEM
    const cIn = mv(t, tSingle + .2, 1.3), cOut = mv(t, tBoard - .1, 1.4);
    if (cIn > 0 && cOut < 1) {
      const cs = expoIn(clamp(cOut * 1.3));
      B.ground(ctx, GR0, cIn * (1 - cOut));
      const hands = B.figure(ctx, t, COL.x, FL, COL.h, { u: cIn, sink: cs, top: 1, glow: .3, glowCol: GOLD, fig: { look: .2, dir: -1, armR: [.9, 1.2], rim: GOLD.line, back: .3 } });
      // the threads: from every card (over the folder) back to the colleague's hand
      const hx = hands ? hands.R[0] : COL.x, hy = hands ? hands.R[1] : FL - COL.h * .5;
      CARDS.forEach((C, i) => {
        const u = span(t, tSingle + .5 + i * .07, tColleague + .2 + i * .06) * (1 - cs);
        const cx = FOLD2.x + FOLD2.w / 2 + C.dx * (FOLD2.w / FOLD.w), cy = FOLD2.y + 30 - 30 - (i % 3) * 6 - 40;
        B.thread(ctx, t, [cx, cy], [hx, hy], u, { a: .55, w: 1.6, sag: .12, col: GOLD.line });
      });
      // the people involved, grey; dashed lines from the folder that never reach them
      INV.forEach(([x, h], i) => {
        const u = clamp((span(t, tCheck - .1, tCheck + 1.1) - i * .12) * 1.4); if (u <= 0) return;
        B.figure(ctx, t, x, FL, h, { u, sink: cs, glow: .08, glowCol: { halo: CREAM2, core: CREAM2 }, fig: { light: .6, look: .3, dir: -1, rim: mixHex(CREAM2, P.night1, .2), back: 0 } });
        const reach = sineIO(span(t, tInv - .3 + i * .15, tInv + .5 + i * .15)) * (1 - sineIO(span(t, tInv + 1.0, tInv + 1.8)));
        const a0 = [FOLD2.x + FOLD2.w, FOLD2.y + 60], a1 = [x - 50, FL - h * .6];
        if (reach > 0) B.thread(ctx, t, a0, [lerp(a0[0], a1[0], .84 * reach), lerp(a0[1], a1[1], .84 * reach)], 1, { dash: [12, 12], a: .8, w: 3, sag: .04, col: CREAM });
      });
      const lu = span(t, tColleague - .1, tColleague + .6) * (1 - span(t, tBoard - .3, tBoard + .2));
      B.caps(ctx, 'ONE COLLEAGUE', COL.x, FL - COL.h - 50, 32, lu, { align: 'center', g: 1 });
      const nu = span(t, tInv - .2, tInv + .5) * (1 - span(t, tBoard - .3, tBoard + .2));
      B.caps(ctx, 'NOT CHECKED WITH THEM', 1620, FL - 400, 30, nu, { align: 'center' });
    }
    // ============================================================== 1.08 · the call grid hurries in; "the process was rushed."
    const gIn = mv(t, tBoard + .1, 1.5);
    if (gIn > 0 && t < tEnd + 1.6) {
      const dx = (1 - expoOut(gIn)) * 1300, hurry = span(t, tFast - .3, tFast + .2) * (1 - span(t, tRushed + 1.2, tRushed + 2.2));
      if (t < tEnd) { ctx.save(); ctx.translate(dx, 0);
      B.callFrame(ctx, GRID, F.SOURCES.call);
      TILES.forEach((tl, i) => {
        if (tl.kind === 'boss') { const r = gridTile(GRID, i); ctx.strokeStyle = rgba(CREAM2, .4); ctx.lineWidth = 1.5; ctx.setLineDash([8, 8]); ctx.strokeRect(r.x, r.y, r.w, r.h); ctx.setLineDash([]); B.caps(ctx, 'FIRED', r.x + r.w / 2, r.y + r.h * .58, 30, 1, { align: 'center', col: CREAM2 }); return; }
        const r = gridTile(GRID, i), jig = hurry * Math.sin(t * 23 + i * 2.1) * 5;
        if (hurry > 0) for (let k = 0; k < 3; k++) { ctx.fillStyle = rgba(CREAM, .35 * hurry); ctx.fillRect(r.x - 30 - k * 26 - 40 * hurry, r.y + r.h * (.3 + k * .2), 20 + 30 * hurry, 3); }
        B.tile(ctx, t, { ...r, x: r.x + jig }, { kind: tl.kind, label: tl.label, sub: tl.sub });
      });
      ctx.restore(); }
      // the quote card: rises on "rushed" (paper, the words gold as spoken)
      const qu = span(t, tRushed - .5, tRushed + .9), qOut = mv(t, tEnd - .1, 1.5);
      if (qu > 0 && qOut < 1) {
        ctx.save(); ctx.translate(320 * (1 - sineIO(span(qu, 0, .8))), 1000 * qOut); ctx.rotate(.04 * qOut);
        const box = F.paperCard(ctx, t, QC.x, QC.y, QC.w, 250, { u: qu, head: 'HE SAID', src: 'SWORN TESTIMONY, OCT 2025' });
        ctx.save(); ctx.translate(0, (1 - expoOut(qu)) * 40);
        B.spokenQuote(ctx, t, [{ w: '“' + qRush[0].w, s: qRush[0].s }, ...qRush.slice(1, 3), { w: qRush[3].w.replace(/[.”"]+$/, '') + '.”', s: qRush[3].s }], QC.x + 40, QC.y + 140, 52, span(qu, .2, 1), { ink: GOLD.deep, maxW: QC.w - 80 });
        ctx.restore(); ctx.restore();
      }
      B.caps(ctx, 'THE BOARD MOVED TOO FAST', 680, 150, 30, span(t, tFast - .2, tFast + .5) * (1 - span(t, tEnd - .2, tEnd + .4)), { align: 'center' });
    }
  };
  return { keys, draw };
}
