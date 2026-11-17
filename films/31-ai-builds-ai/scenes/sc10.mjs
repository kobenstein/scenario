// c10 · The jar · an index is a list · THE BELL RINGS ★ (STEP 4, +15 trading days) · fast lists vs S&P, at least a year · a slice lands in
// the jar, within weeks · the senator's letter · buy, or don't.  (builder B3)
// The camera, the world and the composition of B3 live in sc09.mjs (b3(T): one take from 'Reports say there are' to the end); this
// file holds c10's explainer layer (overlays10) and returns the shared draw for its range.
//
// | ID   | anchor (phrase)              | picture (one idea)                                                                 | camera / layer          |
// |------|------------------------------|------------------------------------------------------------------------------------|-------------------------|
// | 9.01 | And one thing doesn't depend | you on the rooftop, the jar beside you (the "$ ?" tag is pulled up into the crystal) | descent · SCENE         |
// | 9.02 | Many funds don't             | a FUND box; the INDEX list rises; the fund copies it line by line                  | glide behind the veil · EXPL |
// | 9.03★| When the bell rings          | the lists sink; the bell swings back and strikes: gold rings over the city; the board: STEP 4, then big: +15 TRADING DAYS | the bell · MIX |
// | 9.04 | Other big lists              | the board shrinks; its rail clones into three rails: NASDAQ-100 (15 TRADING DAYS) · OTHER FAST LISTS · S&P 500 (AT LEAST A YEAR) | glide behind the veil · EXPL |
// | 9.05 | Say your pension             | the rails sink; the fast rail's shard flies into the jar: WITHIN WEEKS             | the jar · MIX           |
// | 9.06 | A United States senator      | a letter grows out of the jar: Retirement money / that may have to buy, / whatever the price. | creep · EXPL     |
// | 9.07 | So buy, or don't             | the letter goes back into the jar; pull back: you, the jar, the far window with the wheel | pull back · MIX   |
// carriers: the tag → you · the jar → the list → (sink) the bell → the board's rail → three rails → the fast rail's shard → the jar → the letter → the jar → the window
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f59_kit.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, smooth, halo, mixHex } = E;
const { rise, GOLD, PAPER, COOL, maskLine } = F;

export default async (T, R) => { const { b3, PRINT } = await import('./sc09.mjs'); E.prepareEditorial(); return [{ t: R.a, draw: b3(T), print: PRINT }]; };

// sink(ctx, u, y): everything drawn after it disappears below the line y as u goes 0 → 1 (a mask wipe down)
function sinkMask(ctx, u, y = 830, d = 640) { if (u <= 0) return; ctx.beginPath(); ctx.rect(-W, -H, W * 3, y + H); ctx.clip(); ctx.translate(0, d * sineIO(u)); }

export function overlays10(T, a) {
  // ---------------------------------------------------------------- veil + the board's size
  const big = (t) => span(t, a.clock + .15, a.clock + 2.0) * (1 - span(t, a.other - .1, a.other + 1.7));
  const veil = (t) => Math.max(
    .8 * sineIO(span(t, a.funds - .4, a.funds + 1.4)) * (1 - sineIO(span(t, a.bell - .3, a.bell + 1.7))),
    .7 * sineIO(span(t, a.clock + .0, a.clock + 1.8)) * (1 - sineIO(span(t, a.pension - .4, a.pension + 1.4))),
    .6 * sineIO(span(t, a.senator - .4, a.senator + 1.4)) * (1 - sineIO(span(t, a.buy - .1, a.buy + 1.7))));

  // ---------------------------------------------------------------- 9.02 the index and the fund
  const ROWS = 8, LX = 560, FX = 1080, RY = 352, RH = 52, widths = [300, 230, 270, 190, 320, 250, 210, 280];
  const rowY = (i) => RY + i * RH;
  function lists(ctx, t) {
    if (t < a.funds - .2 || t > a.bell + 1.5) return;
    const out = span(t, a.bell - .4, a.bell + 1.4);
    ctx.save(); F.float(ctx, t, 1); sinkMask(ctx, out);
    // the FUND box (an empty frame waiting) and its rows (copies)
    const fu = sineIO(span(t, a.funds, a.funds + .9));
    if (fu > 0) {
      ctx.strokeStyle = rgba(COOL.line, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(FX - 30, RY - 82, 400, (ROWS * RH + 100) * fu, 14); ctx.stroke();
      maskLine(ctx, [['FUND', 0]], FX, RY - 38, 26, rise(span(t, a.funds + .2, a.funds + .9)), { serif: false, weight: 600, col: COOL.text, glow: false });
    }
    // the INDEX list rises row by row, then each row is copied across (a spark flies, the copy wipes in)
    maskLine(ctx, [['INDEX', 0]], LX, RY - 38, 26, rise(span(t, a.index - .05, a.index + .6)), { serif: false, weight: 600, col: GOLD.text, glow: false });
    for (let i = 0; i < ROWS; i++) {
      const y = rowY(i), ru = expoOut(span(t, a.copy - .25 + i * .06, a.copy + .35 + i * .06)); if (ru <= 0) continue;
      ctx.fillStyle = rgba(P.cream, .1); ctx.fillRect(LX - 10, y + RH - 6, 340, 1);
      ctx.fillStyle = mixHex(COOL.body, P.night1, .35); ctx.beginPath(); ctx.roundRect(LX, y + 10 + (1 - ru) * 20, widths[i] * ru, 24, 12); ctx.fill();
      const tc = a.copy + .4 + i * .18, fly = span(t, tc, tc + .3), cu = expoOut(span(t, tc + .25, tc + .6));
      if (fly > 0 && fly < 1) { const x = lerp(LX + widths[i] + 12, FX - 6, sineIO(fly)); halo(ctx, x, y + 22, 26, .6, COOL.halo, COOL.core); ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(x, y + 22, 4, 0, Math.PI * 2); ctx.fill(); }
      if (cu > 0) { ctx.fillStyle = mixHex(COOL.body, P.night1, .35); ctx.beginPath(); ctx.roundRect(FX, y + 10, widths[i] * cu, 24, 12); ctx.fill(); }
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- 9.04 three rails (clones of the board's rail)
  const RL = [{ y: 430, len: 520, name: 'NASDAQ-100', end: '15 TRADING DAYS', col: GOLD }, { y: 560, len: 520, name: 'OTHER FAST LISTS', col: COOL }, { y: 690, len: 1500, name: 'S&P 500', end: 'AT LEAST A YEAR', col: COOL }];
  const X0 = 560;
  const r1 = (t) => sineIO(span(t, a.other - .05, a.other + 1.75)), r2 = (t) => sineIO(span(t, a.notall - .25, a.notall + .95)), r3 = (t) => sineIO(span(t, a.snp - .3, a.snp + 1.3));
  const tok1 = (t) => sineIO(span(t, a.other + 1.8, a.other + 3.4)), tok2 = (t) => sineIO(span(t, a.notall + 1.0, a.notall + 2.5)), tok3 = (t) => .045 * smooth(span(t, a.snp + 1.3, a.wait + 2));
  const railsOut = (t) => span(t, a.pension - .25, a.pension + .95);
  // the rail of the big board (F.board geometry at big = 1)
  const BR = { x0: W / 2 - 245 * 1.9 + 6 * 1.9, x1: W / 2 - 245 * 1.9 + 386 * 1.9, y: 300 + 34 * 1.9 };
  const fly = (t) => span(t, a.slice - .15, a.tLand);                 // the fast rail's shard flies into the jar
  const tok1Pos = () => [X0 + RL[0].len, RL[0].y];
  function railLine(ctx, x0, x1, y, col, u, ticks) {
    if (u <= 0) return;
    ctx.strokeStyle = rgba(col.line, .8); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    if (ticks) { ctx.fillStyle = rgba(col.line, .5); for (let x = x0 + ticks; x < Math.min(x1, W + 20); x += ticks) ctx.fillRect(x - 1, y - 7, 2, 14); }
  }
  function rails(ctx, t) {
    if (t < a.other - .2 || t > a.pension + 1.1) return;
    const m1 = r1(t), m2 = r2(t), m3 = r3(t), out = railsOut(t);
    ctx.save(); F.float(ctx, t, 1); sinkMask(ctx, out, 830);
    // rail 1 glides out of the board's rail (which shrinks back to the corner)
    const y1 = lerp(BR.y, RL[0].y, m1), xa = lerp(BR.x0, X0, m1), xb = lerp(BR.x1, X0 + RL[0].len, m1);
    railLine(ctx, xa, xb, y1, GOLD, 1, m1 > .9 ? RL[0].len / 15 : 0);
    // rail 2 splits off rail 1, rail 3 off rail 2 (and runs on, out of the frame)
    if (m2 > 0) railLine(ctx, X0, X0 + RL[1].len, lerp(RL[0].y, RL[1].y, m2), COOL, 1, m2 > .9 ? RL[1].len / 15 : 0);
    if (m3 > 0) railLine(ctx, X0, X0 + lerp(RL[1].len, RL[2].len, m3), lerp(RL[1].y, RL[2].y, m3), COOL, 1, m3 > .9 ? RL[1].len / 15 : 0);
    const lab = [rise(span(m1, .6, 1)), rise(span(m2, .5, 1)), rise(span(m3, .4, 1))];
    RL.forEach((r, i) => {
      if (lab[i] <= 0) return;
      maskLine(ctx, [[r.name, 0]], X0, r.y - 26, 26, lab[i], { serif: false, weight: 600, col: i ? COOL.text : GOLD.text, glow: false });
      if (i < 2) { ctx.strokeStyle = rgba(r.col.line, .9 * lab[i]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0 + r.len, r.y - 18); ctx.lineTo(X0 + r.len, r.y + 18); ctx.stroke(); }
    });
    maskLine(ctx, [['15 TRADING DAYS', 0]], X0 + RL[0].len + 34, RL[0].y + 9, 26, rise(span(t, a.other + 1.2, a.other + 2)), { serif: false, weight: 600, col: GOLD.text, glow: false });
    maskLine(ctx, [['AT LEAST A YEAR', 0]], 1560, RL[2].y - 26, 26, rise(span(t, a.wait - .1, a.wait + .6)), { serif: false, weight: 600, col: COOL.text, glow: false, align: 'right' });
    // the shards on the rails: fast on the fast rails, a crawl on the S&P rail
    if (m2 > .6) F.shard(ctx, t, X0 + 24 + (RL[1].len - 48) * tok2(t), RL[1].y - 2, 34, { glow: .5, a: span(m2, .6, .9) });
    if (m3 > .6) F.shard(ctx, t, X0 + 24 + (RL[2].len - 48) * tok3(t), RL[2].y - 2, 34, { glow: .5, a: span(m3, .6, .9) });
    if (m1 > .6 && fly(t) <= 0) F.shard(ctx, t, X0 + 24 + (RL[0].len - 48) * tok1(t), RL[0].y - 2, 34, { glow: .6, a: span(m1, .6, .9) });
    ctx.restore();
  }
  // 9.05 the fast rail's shard (stays when the rails sink) flies on an arc into the jar
  function slice(ctx, t, g) {
    if (t < a.pension - .3 || t >= a.tLand || !g.jar) return;
    const f = fly(t), [x0, y0] = [X0 + 24 + (RL[0].len - 48), RL[0].y - 2];
    const k = g.jar[2], jx = g.jar[0], jy = g.jar[1] - 120 * .86 * .42 * k;   // the jar's slice spot (F.jar: fill .42)
    const e = sineIO(f), x = lerp(x0, jx, e), y = lerp(y0, jy, e) - 220 * Math.sin(Math.PI * e), s = lerp(34, 120 * .18 * k, e);
    const pulse = Math.sin(Math.PI * span(t, a.fastlists, a.fastlists + .9));
    ctx.save(); F.float(ctx, t, 1 - e);
    F.shard(ctx, t, x, y, s * (1 + .15 * pulse), { glow: .6 + .5 * pulse, rot: .3 * Math.sin(Math.PI * e) });
    ctx.restore();
  }
  function weeks(ctx, t, g) {
    const u = rise(span(t, a.weeks - .1, a.weeks + .6)) * (1 - span(t, a.senator - .4, a.senator + .1)); if (u <= 0 || !g.jar) return;
    const k = g.jar[2];
    F.goldLabel(ctx, g.jar[0] + 45 * k, g.jar[1] - 60 * k, 'WITHIN WEEKS', null, u, { dx: 110, dy: -14, size: 34 });
  }

  // ---------------------------------------------------------------- 9.06 the letter (grows out of the jar, goes back into it)
  const LC = { x: 470, y: 190, w: 980, h: 470 };
  const lg = (t) => sineIO(span(t, a.senator - .05, a.senator + 1.55)), lb = (t) => sineIO(span(t, a.buy - .1, a.buy + 1.6));
  function letter(ctx, t, g) {
    const u = lg(t); if (u <= 0 || !g.jar) return;
    const b = lb(t); if (b >= 1) return;
    const k = g.jar[2], jw = 120 * .62 * k, jh = 120 * .9 * k, from = { x: g.jar[0] - jw / 2, y: g.jar[1] - jh, w: jw, h: jh };
    const m = u * (1 - b), r = { x: lerp(from.x, LC.x, m), y: lerp(from.y, LC.y, m), w: lerp(from.w, LC.w, m), h: lerp(from.h, LC.h, m) };
    ctx.save(); F.float(ctx, t, 1); ctx.globalAlpha *= clamp(m * 6);
    ctx.translate(r.x, r.y); ctx.scale(r.w / LC.w, r.h / LC.h);
    F.paperCard(ctx, t, 0, 0, LC.w, LC.h, { u: 1, rot: -.008 });
    const gl = (t0) => clamp((t - t0 + .05) / .3);
    const L1 = rise(span(t, a.retire - .15, a.retire + .5)), L2 = rise(span(t, a.that - .15, a.that + .5)), L3 = rise(span(t, a.whatever - .15, a.whatever + .5));
    F.goldText(ctx, [['Retirement money', 0]], 70, 150, 70, L1, { serif: true, col: mixHex(PAPER.ink, GOLD.deep, .85 * gl(a.retire)) });
    F.goldText(ctx, [['that may have to buy,', 0]], 70, 240, 70, L2, { serif: true, col: PAPER.ink });
    F.goldText(ctx, [['whatever the price.', 0]], 70, 330, 70, L3, { serif: true, col: mixHex(PAPER.ink, GOLD.deep, .85 * gl(a.whatever)) });
    maskLine(ctx, [[F.SOURCES.warren.toUpperCase(), 0]], 72, LC.h - 44, 22, rise(span(t, a.letter - .1, a.letter + .6)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
    ctx.restore();
  }
  // 9.07 the far window glints on "without a say"
  function glint(ctx, t, g) {
    const u = Math.sin(Math.PI * span(t, a.nosay - .1, a.nosay + 2.2)); if (u <= 0 || !g.win) return;
    const w = g.win; halo(ctx, w.x + w.w / 2, w.y + w.h * .3, w.w * 1.1, .32 * u, GOLD.halo, GOLD.hot);
  }
  function over(ctx, t, g) {
    lists(ctx, t); rails(ctx, t); slice(ctx, t, g); weeks(ctx, t, g); letter(ctx, t, g); glint(ctx, t, g);
    F.source(ctx, t, a.rule, a.other + .4, F.SOURCES.nasdaq);
  }
  return { veil, over, big };
}
