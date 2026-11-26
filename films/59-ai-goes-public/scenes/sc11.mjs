// c11 · Amazon, Google: no vote · the wheel is not for sale · eleven people, the same dinner table ★ · the board must balance three
// things (public benefit corporation).  (builder B3)
// The camera, the world and the composition of B3 live in sc09.mjs (b3(T)); this file holds c11's explainer layer (overlays11).
//
// | ID    | anchor (phrase)                | picture (one idea)                                                                | camera / layer       |
// |-------|--------------------------------|-----------------------------------------------------------------------------------|----------------------|
// | 10.01 | But look at who else           | the far window's frame stretches into the vote bar (49.9 / 50.1); a third row: NON-VOTING SHARES (CLASS N): AMAZON · GOOGLE, empty vote circles | wide creep · EXPL |
// | 10.02 | As this company is built today | the bar folds back into the window; we dive in: the wheel behind its glass; a tag NOT FOR SALE; it only tugs "at any price"; warm | dive · MIX |
// | 10.03 | The hard part                  | pull back: the room through its window                                            | pull back · SCENE    |
// | 10.04★| Seven founders                 | THE SAME DINNER TABLE: 7 + 4 light as counted; a slow push, the room glows        | push · SCENE         |
// | 10.05 | But the board they choose      | the table's edge lifts out as a gold beam on a thread; three tags hang on as said: STOCKHOLDERS · THE STATED PURPOSE · THOSE MATERIALLY AFFECTED; it balances | glide behind the veil · EXPL |
// carriers: the window frame → the vote bar → the window → the wheel → the tag → the room → the table's edge → the beam → (c12) the crystal's gap
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f59_kit.mjs';
import * as S from '../lib/f59_world.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, smooth, halo, mixHex } = E;
const { rise, GOLD, PAPER, COOL, LAMP, maskLine } = F;

export default async (T, R) => { const { b3, PRINT } = await import('./sc09.mjs'); E.prepareEditorial(); return [{ t: R.a, draw: b3(T), print: PRINT }]; };

export function overlays11(T, a, X) {
  const veil = (t) => Math.max(
    .8 * sineIO(span(t, a.c11 - .3, a.c11 + 1.5)) * (1 - sineIO(span(t, a.built - .3, a.built + 1.7))),
    .8 * sineIO(span(t, a.board - .2, a.board + 1.6)) * (1 - sineIO(span(t, a.c12 - .15, a.c12 + 1.8))));

  // ---------------------------------------------------------------- 10.01 the vote bar returns, with a third row (CLASS N)
  const BAR = { x: 260, y: 250, w: 1400, h: 64 }, GB = { x: 230, y: 200, w: 1460, h: 560 };
  const mIn = (t) => sineIO(span(t, a.c11 - .05, a.c11 + 1.8)), mOut = (t) => sineIO(span(t, a.built - .3, a.built + 1.7));
  function block(ctx, t, x, y, name, u, nv) {
    if (u <= 0) return;
    const w = 340, h = 96, k = expoOut(u);
    ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(0, (1 - k) * 30);
    ctx.fillStyle = E.lin(ctx, x, y, x + w, y + h, [[0, mixHex(COOL.deep, P.night1, .2)], [1, mixHex(COOL.deep, COOL.body, .25)]]); ctx.beginPath(); ctx.roundRect(x, y, w * k, h, 12); ctx.fill();
    ctx.strokeStyle = rgba(COOL.line, .7); ctx.lineWidth = 2; ctx.stroke();
    maskLine(ctx, [[name, 0]], x + 28, y + 60, 32, rise(span(u, .3, 1)), { serif: false, weight: 600, col: P.cream, glow: false });
    // the vote circle stays empty: no tick (a short dash draws through it on "no vote")
    const cx = x + w - 52, cy = y + h / 2;
    ctx.strokeStyle = rgba(P.cream, .75); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.stroke();
    if (nv > 0) { ctx.strokeStyle = rgba(P.cream, .9); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - 11, cy); ctx.lineTo(cx - 11 + 22 * expoOut(nv), cy); ctx.stroke(); }
    ctx.restore();
  }
  function bar(ctx, t, g) {
    const mi = mIn(t); if (mi <= 0 || !g.win) return;
    const mo = mOut(t); if (mo >= 1) return;
    const w = g.win;
    ctx.save(); F.float(ctx, t, 1 - mo);
    // folding back into the window: the whole group scales into the window rect
    if (mo > 0) {
      const s = lerp(1, w.w / GB.w, mo), cx = lerp(GB.x + GB.w / 2, w.x + w.w / 2, mo), cy = lerp(GB.y + GB.h / 2, w.y + w.h / 2, mo);
      ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-(GB.x + GB.w / 2), -(GB.y + GB.h / 2)); ctx.globalAlpha *= 1 - span(mo, .8, 1);
    }
    if (mi < 1) {   // the window's frame stretches into the bar's frame
      const r = { x: lerp(w.x, BAR.x, mi), y: lerp(w.y, BAR.y, mi), w: lerp(w.w, BAR.w, mi), h: lerp(w.h, BAR.h, mi) };
      ctx.strokeStyle = rgba(mixHex(GOLD.line, P.cream, mi), .55 + .3 * (1 - mi)); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 10 * mi); ctx.stroke();
      ctx.restore(); return;
    }
    F.voteBar(ctx, t, BAR.x, BAR.y, BAR.w, { u: 1, pub: span(t, a.c11 + 1.7, a.c11 + 2.7), fnd: span(t, a.c11 + 2.0, a.c11 + 3.0), cap: span(t, a.c11 + 2.4, a.c11 + 3.2), labels: span(t, a.c11 + 2.6, a.c11 + 3.6) });
    const ru = span(t, a.amazon - .2, a.amazon + .7);
    maskLine(ctx, [['NON-VOTING SHARES (CLASS N)', 0]], BAR.x, 512, 26, rise(ru), { serif: false, weight: 600, col: COOL.text, glow: false });
    const nv = span(t, a.novote - .1, a.novote + .4);
    block(ctx, t, BAR.x, 548, 'AMAZON', span(t, a.amazon + .2, a.amazon + 1.0), nv);
    block(ctx, t, BAR.x + 380, 548, 'GOOGLE', span(t, a.google - .15, a.google + .65), nv);
    maskLine(ctx, [['MORE THAN 5 % OF THE COMPANY EACH', 0]], BAR.x, 704, 26, rise(span(t, a.google + .9, a.google + 1.6)), { serif: false, weight: 600, col: P.cream, glow: false });
    ctx.restore();
  }

  // ---------------------------------------------------------------- 10.02 NOT FOR SALE (a tag tied to the wheel), warm
  const tagU = (t) => span(t, a.nfs + .2, a.nfs + 1.0) * (1 - span(t, a.hard - .35, a.hard + .45));
  function notForSale(ctx, t, g) {
    const u = tagU(t); if (u <= 0 || !g.wheel) return;
    const [wx, wy, k] = g.wheel, r = S.WIN.h * .12 * k, tug = Math.sin(Math.PI * span(t, a.anyprice - .05, a.anyprice + .9));
    const warm = sineIO(span(t, a.hopeful - .2, a.hopeful + 1.4)) * (1 - span(t, a.hard - .2, a.hard + 1.2));
    if (warm > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; halo(ctx, wx, wy, r * 5, .22 * warm, GOLD.halo, GOLD.hot); ctx.restore(); }
    F.priceTag(ctx, t, wx, wy + r * 1.45, ['NOT FOR SALE'], u, { size: 30, len: 70 + 26 * tug, swing: .08 * tug * Math.sin(t * 9) });
  }

  // ---------------------------------------------------------------- 10.04 7 FOUNDERS · 4 TRUSTEES (under the window)
  function count(ctx, t, g) {
    if (!g.win || t < a.seven - .3) return;
    const out = span(t, a.board - .1, a.board + .6), y = Math.min(860, g.win.y + g.win.h + 62);
    ctx.save(); F.float(ctx, t, .5);
    F.goldText(ctx, [['7 FOUNDERS', 1]], W / 2 - 28, y, 30, rise(span(t, a.seven - .05, a.seven + .6)) * (1 - out), { serif: false, weight: 600, align: 'right', spacing: .1 });
    maskLine(ctx, [['4 TRUSTEES', 0]], W / 2 + 28, y, 30, rise(span(t, a.four - .05, a.four + .6)) * (1 - out), { serif: false, weight: 600, col: LAMP.core, glow: false });
    ctx.restore();
  }

  // ---------------------------------------------------------------- 10.05 the beam: three weights
  const BM = { x: W / 2, y: 392, hw: 520 };
  const bIn = (t) => sineIO(span(t, a.board + .05, a.board + 2.05)), bOut = (t) => sineIO(span(t, a.c12 - .1, a.c12 + 1.8));
  const tilt = (t) => -.065 * sineIO(span(t, a.money + .25, a.money + 1.3)) + .065 * sineIO(span(t, a.everyone + .3, a.everyone + 1.6)) + .006 * Math.sin(t * .7);
  const TAGS = [
    { f: -.88, at: () => a.money, lines: [['STOCKHOLDERS', 1]] },
    { f: 0, at: () => a.purpose, lines: [['THE STATED PURPOSE', 1], ['“…FOR THE LONG-TERM', 1], ['BENEFIT OF HUMANITY”', 1]] },
    { f: .88, at: () => a.everyone, lines: [['“THOSE MATERIALLY', 1], ['AFFECTED BY', 1], ['OUR CONDUCT”', 1]] },
  ];
  function beam(ctx, t, g) {
    const bi = bIn(t); if (bi <= 0) return;
    const bo = bOut(t); if (bo >= 1) return;
    // the source: the table's front edge in the window (window-local 17 %–83 % at 65 % height)
    const c = g.c, p0 = E.project(c, S.Z_CITY, S.WIN.x + S.WIN.w * .17, S.WIN.y + S.WIN.h * .65), p1 = E.project(c, S.Z_CITY, S.WIN.x + S.WIN.w * .83, S.WIN.y + S.WIN.h * .65);
    const th = tilt(t), ca = Math.cos(th), sa = Math.sin(th), end = (s) => [BM.x + s * BM.hw * ca, BM.y + s * BM.hw * sa];
    const e0 = end(-1), e1 = end(1);
    const A = p0 ? [lerp(p0[0], e0[0], bi), lerp(p0[1], e0[1], bi)] : e0, B = p1 ? [lerp(p1[0], e1[0], bi), lerp(p1[1], e1[1], bi)] : e1;
    ctx.save(); F.float(ctx, t, bi * (1 - bo));
    if (bo > 0 && g.gap) {   // the whole balance draws up into the crystal's gap (where the warning hangs)
      const s = lerp(1, .03, bo), cx = lerp(BM.x, g.gap[0], bo), cy = lerp(BM.y + 120, g.gap[1], bo);
      ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-BM.x, -(BM.y + 120)); ctx.globalAlpha *= 1 - span(bo, .85, 1);
    }
    // the thread it hangs from (up to the top edge) and the beam
    const mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    F.goldSpan(ctx, [[mid[0], mid[1]], [mid[0], -20]], 0, span(t, a.board + 1.5, a.board + 2.6), { w: 1.3, spark: true });
    F.goldSpan(ctx, [A, B], 0, 1, { w: 3.4, spark: false });
    ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(mid[0], mid[1], 7, 0, Math.PI * 2); ctx.fill();
    // the three weights (tags) hang on as they are said
    for (const tg of TAGS) {
      const u = span(t, tg.at() - .15, tg.at() + .75); if (u <= 0) continue;
      const hx = lerp(A[0], B[0], (tg.f + 1) / 2), hy = lerp(A[1], B[1], (tg.f + 1) / 2);
      X.tagLines(ctx, t, hx, hy, tg.lines.map(([l], i) => [l, span(t, tg.at() + .1 + i * .18, tg.at() + .7 + i * .18)]), u, { size: 28, len: 50, swing: -th });
    }
    F.goldText(ctx, [['PUBLIC BENEFIT CORPORATION', .9]], W / 2, 770, 40, rise(span(t, a.legal - .1, a.legal + .6)), { serif: false, weight: 600, align: 'center', spacing: .08 });
    maskLine(ctx, [['THE BOARD MUST BALANCE', 0]], W / 2, 816, 24, rise(span(t, a.three - .1, a.three + .6)), { serif: false, weight: 600, col: P.cream, glow: false, align: 'center' });
    ctx.restore();
  }
  function over(ctx, t, g) {
    bar(ctx, t, g); notForSale(ctx, t, g); count(ctx, t, g); beam(ctx, t, g);
    F.source(ctx, t, a.amazon + .5, a.built + .2, F.SOURCES.prospectus);
    F.source(ctx, t, a.legal, a.c12 + .3, F.SOURCES.pbc);
  }
  return { veil, over };
}
