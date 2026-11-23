// c10 · B3 · the ways · 'The labs could' → 'Superintelligence is arriving. So'
// The town-hall pane shrinks away down-left and uncovers THE LABS: Wang's X crop "…the “default path” in front of us" unrolls
// (highlighter), a broad road DEFAULT PATH runs toward you, a fork branches off, only dashed (nobody says how); a referee's desk before
// each lab, every answer (a small gold file) stops there; one lab skips it and pulls ahead (OPTION · UNTESTED); a gold line across the
// road where all labs stop (the rule); a form card SHOW YOUR WORK while the camera travels back to the town; behind the referee a second,
// bigger shadow and a ?; the open rule book, LEAN FRO · NONPROFIT, the engineer runs it on her own laptop; ★ you cross the old bridge,
// under the deck a small engineer with her sheet; the new, slender bridge rises from the river: the place under its deck is empty;
// a table with four chairs LABS · GOVERNMENTS · INVESTORS · VOTERS, your raincoat over the fourth; Wang's "next year" crop and a wall
// calendar with twelve empty months, the first leaf comes loose (no clock face). Under the veil the camera flies home (c11: the headline).
//
// | ID   | anchor                       | picture (one idea)                                                     | camera                 |
// |------|------------------------------|------------------------------------------------------------------------|------------------------|
// | 9.01 | The labs could               | pane shrinks away; X crop default path; the road DEFAULT PATH          | creep · EXPL           |
// | 9.02 | He doesn't say exactly how   | the fork, only dashed                                                  | creep · MIX            |
// | 9.03 | One way: labs agree          | a referee's desk before each lab; one lab skips it; OPTION · UNTESTED   | push · EXPL            |
// | 9.04 | So governments could         | a gold line across the road · SHOW YOUR WORK · who checks the checkers? | travel (veil) · EXPL   |
// | 9.05 | Mathematics has one answer   | the open rule book, LEAN FRO · NONPROFIT, the engineer's own laptop    | creep · MIX            |
// | 9.06★| The hardest objection        | you on the old bridge, an engineer under it · the new bridge: nobody   | glide left · SCENE     |
// | 9.07 | None of this is agreed       | table, four chairs, your raincoat over VOTERS                          | creep (veil) · EXPL    |
// | 9.08 | And Wang puts a clock        | X crop next year + a wall calendar, the first leaf comes loose         | fly home (veil) · EXPL |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f67_kit.mjs';
import * as S from '../lib/f67_world.mjs';
import * as B from '../lib/b3_extra.mjs';
import { pane, paneRect } from './sc09.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, smooth, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL, EARTH } = F;
const { GY, ROAD, NEWB } = B;

export default async (T, R) => [{ t: R.a, draw: await B.b3(T), print: F.PRINT67 }];

const LABX = [S.LABS.meta, S.LABS.other], REFX = -290, ENGX = -120;
export const part = {
  keys: (A) => [
    [A.labs, ROAD.x, GY - 60, 1.5], [A.how + .5, ROAD.x + 60, GY - 50, 1.44], [A.oneWay + 1.2, ROAD.x - 40, GY - 30, 1.62], [A.govts + 1.6, ROAD.x, GY - 30, 1.52],
    [A.town2 + .3, ROAD.x - 200, GY - 60, 1.3], [A.town2 + 1.9, 2300, GY - 200, .55], [A.checkers - .1, -320, GY - 110, 1.9], [A.engineer + 1.0, -280, GY - 100, 2.0],
    [A.hardest + 2.2, -1340, GY - 10, 2.7], [A.until - .1, -1300, GY - 10, 2.85], [A.until + 2.1, NEWB.x + 10, GY - 10, 2.6], [A.clock + .6, NEWB.x + 60, GY - 20, 2.5],
    [A.si - .4, 960, 540, 1.0],
  ],
  draw: frame,
};

// the answers: small gold files out of each lab's door, through the referee's desk, down the road (one lab skips; the rule line stops all)
function answers(cx, t, A) {
  const on = span(t, A.oneWay + .2, A.oneWay + .8) * (1 - span(t, A.town2 + .6, A.town2 + 1.4)); if (on <= 0) return;
  const skip = span(t, A.objection, A.objection + 1.0), ruleY = GY + 130, rule = span(t, A.rule, A.rule + .6);
  for (const [li, x] of LABX.entries()) for (let k = 0; k < 3; k++) {
    const sk = li === 1 ? skip : 0, sp = .3 + .18 * sk, ph = ((t - A.oneWay) * sp + k / 3 + li * .17) % 1;
    const desk = [x + 60 * sk, GY + 34], end = [lerp(x, ROAD.x, .55) + 180 * sk, GY + 290];
    let px, py;
    if (ph < .3) { const f = sineIO(ph / .3); px = lerp(x, desk[0], f) + 40 * sk * Math.sin(Math.PI * f); py = lerp(GY - 18, desk[1], f); }
    else if (ph < .45 && sk < .5) { px = desk[0]; py = desk[1]; }
    else { const f = sineIO((ph - (sk < .5 ? .45 : .3)) / (sk < .5 ? .55 : .7)); px = lerp(desk[0], end[0], f); py = lerp(desk[1], end[1], f); }
    if (rule > 0) py = Math.min(py, lerp(1e4, ruleY - 14, rule));
    const s = 18 * clamp(ph * 10) * clamp((1 - ph) * 8 + (rule > 0 && py >= ruleY - 15 ? 1 : 0));
    if (s > 1) F.file(cx, t, px, py, s, { glow: .8, a: on, seed: 3 + k });
  }
  for (const [li, x] of LABX.entries()) {   // the desks with a referee each
    const du = span(t, A.oneWay - .1, A.oneWay + .9) * (1 - span(t, A.town2 + .6, A.town2 + 1.4)); if (du <= 0) continue;
    cx.save(); cx.beginPath(); cx.rect(x - 120, GY - 200, 240, 250); cx.clip(); cx.translate(0, (1 - expoOut(du)) * 120);
    F.referee(cx, t, x + 44, GY + 40, 58, { dir: -1, look: .2, card: li === 1 ? 1 - skip : Math.sin(Math.PI * (((t - A.oneWay) * .3 + .3) % 1)) > .6 ? 1 : .6 });
    cx.fillStyle = mixHex(EARTH.deep, P.night1, .35); cx.fillRect(x - 4, GY + 16, 60, 8); cx.fillRect(x, GY + 24, 5, 18); cx.fillRect(x + 48, GY + 24, 5, 18);
    cx.restore();
  }
}
function tableScene(ctx, t, A) {   // 9.07 (screen space over the veil)
  const u = span(t, A.noneAgreed - .1, A.noneAgreed + .9) * (1 - span(t, A.clock - .3, A.clock + .7)); if (u <= 0) return;
  const k = expoOut(u), y0 = 560 + (1 - k) * 90;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= clamp(u * 3);
  const xs = [600, 840, 1080, 1320], names = F.SOURCES.seats, at = [A.wLabs, A.wGov, A.wInv, A.wVoters];
  for (const [i, x] of xs.entries()) {   // chair backs behind the table
    const lit = span(t, at[i] - .1, at[i] + .5);
    ctx.fillStyle = mixHex(mixHex(P.night1, P.blue2, .5), GOLD.shade, .5 * lit); ctx.fillRect(x - 46, y0 - 150, 92, 14); ctx.fillRect(x - 46, y0 - 150, 10, 150); ctx.fillRect(x + 36, y0 - 150, 10, 150);
    halo(ctx, x, y0 - 90, 120, .25 * lit, GOLD.halo, GOLD.core);
  }
  const coat = span(t, A.wVoters + .2, A.wVoters + 1.1);   // your raincoat lands over the fourth chair
  if (coat > 0) { const x = xs[3], yy = y0 - 150 - (1 - expoOut(coat)) * 420, rot = (1 - expoOut(coat)) * .5;
    ctx.save(); ctx.translate(x, yy); ctx.rotate(rot); const c = E.COAT;
    ctx.fillStyle = lin(ctx, -60, 0, 60, 0, [[0, c.shade], [.5, c.base], [1, c.lit]]);
    ctx.beginPath(); ctx.moveTo(-50, -6); ctx.quadraticCurveTo(0, -22, 50, -6); ctx.lineTo(58, 70); ctx.quadraticCurveTo(10, 84, -40, 92); ctx.lineTo(-62, 60); ctx.closePath(); ctx.fill();
    ctx.fillStyle = c.deep; ctx.beginPath(); ctx.ellipse(-4, -10, 30, 12, 0, 0, 6.29); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + 22, [[0, mixHex(EARTH.top, P.night1, .35)], [1, mixHex(EARTH.deep, P.night1, .3)]]); ctx.fillRect(460, y0, 1000, 24);
  ctx.fillStyle = mixHex(EARTH.deep, P.night0, .4); ctx.fillRect(500, y0 + 24, 16, 150); ctx.fillRect(1404, y0 + 24, 16, 150);
  for (const [i, x] of xs.entries()) { const lit = span(t, at[i] - .1, at[i] + .5);
    F.goldText(ctx, [[names[i], lit]], x, y0 + 80, 26, F.rise(span(u, .3 + i * .08, .9 + i * .08)), { serif: false, weight: 700, spacing: .08, align: 'center', col: CREAM2 }); }
  F.goldText(ctx, [['NOT AGREED', 0]], W / 2 - 20, 300, 44, F.rise(span(t, A.noneAgreed, A.noneAgreed + .8)) * u, { serif: true, align: 'right', col: CREAM });
  F.goldText(ctx, [['· NOT TESTED', 0]], W / 2, 300, 44, F.rise(span(t, A.tested, A.tested + .8)) * u, { serif: true, col: CREAM });
  ctx.restore();
}
function calendar(ctx, t, A) {   // 9.08: twelve empty months; the first leaf comes loose on 'next year'
  const u = span(t, A.clock + .1, A.clock + 1.1) * (1 - span(t, A.si - 1.4, A.si - .3)); if (u <= 0) return;
  const k = expoOut(u), x0 = 610, y0 = 420 + (1 - k) * 90, cw = 160, chh = 100, gap = 14;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= clamp(u * 3);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(x0 - 26, y0 - 70, 4 * cw + 3 * gap + 52 + 8, 3 * chh + 2 * gap + 96 + 10);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(x0 - 30, y0 - 76, 4 * cw + 3 * gap + 52, 3 * chh + 2 * gap + 96);
  ctx.strokeStyle = rgba(GOLD.line, .5); ctx.lineWidth = 2; ctx.strokeRect(x0 - 30, y0 - 76, 4 * cw + 3 * gap + 52, 3 * chh + 2 * gap + 96);
  F.goldText(ctx, [['THE NEXT 12 MONTHS', 0]], x0, y0 - 30, 24, F.rise(span(u, .3, 1)), { serif: false, weight: 700, spacing: .1, col: CREAM2 });
  const loose = span(t, A.nextYear + .1, A.nextYear + 2.4);
  for (let i = 0; i < 12; i++) {
    const cx = x0 + (i % 4) * (cw + gap), cy = y0 + Math.floor(i / 4) * (chh + gap), f = i === 0 ? loose : 0;
    ctx.save(); ctx.translate(cx + cw / 2 + f * 160, cy + chh / 2 + expoIn(f) * 640 + 40 * Math.sin(Math.PI * f)); ctx.rotate(f * 1.6 + .02 * Math.sin(t * 2 + i) * (i === 0 ? 1 : 0));
    ctx.fillStyle = lin(ctx, -cw / 2, -chh / 2, cw / 2, chh / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-cw / 2, -chh / 2, cw, chh);
    ctx.fillStyle = mixHex(P.blue1, P.night1, .3); ctx.fillRect(-cw / 2, -chh / 2, cw, 14);
    E.glowText(ctx, String(i + 1), -cw / 2 + 12, -chh / 2 + 44, { size: 24, serif: true, col: PAPER.ink, glow: false });
    ctx.restore();
  }
  ctx.restore();
}

function frame(ctx, t, A, c) {
  const T = A.T, pr = paneRect(t, A);
  if (!(pr && pr.g >= 1 && pr.ex <= 0)) {   // the world is hidden while the pane still fills the frame
    const youBridge = t < A.until + 1.6;
    const walk = span(t, A.cross - .4, A.until + 1.6), yx = lerp(-1900, -980, walk);
    S.landWorld(ctx, c, t, { head: { dim: .5 }, hall: 1, windows: .3, ribbon: { u: 1 }, tower: { u: 1, dark: .8 }, chair: { referee: 1, card: 1 },
      you: youBridge ? false : {},
      land: (cx) => {
        B.yesWindows(cx, t, 1, 1);
        F.file(cx, t, S.BOARD.spot.x, S.BOARD.spot.y, 40, { glow: .35, seed: 5 });
        B.road(cx, t, { u: span(t, A.labs + .2, A.labs + 2.2), fork: smooth(span(t, A.how - .1, A.how + 1.4)) });
        const dp = span(t, A.defPath - .1, A.defPath + .7); if (dp > 0) F.goldText(cx, [['DEFAULT PATH', 0]], ROAD.x, GY + 236, 40, F.rise(dp), { serif: false, weight: 700, spacing: .12, align: 'center', col: CREAM });
        answers(cx, t, A);
        const ru = span(t, A.rule - .1, A.rule + .9) * (1 - span(t, A.town2 + .6, A.town2 + 1.4));
        if (ru > 0) { F.goldSpan(cx, [[ROAD.x - 520, GY + 130], [ROAD.x + 520, GY + 130]], 0, smooth(ru), { w: 4 });
          F.goldText(cx, [['A RULE WHERE STAKES ARE HIGH', 1]], ROAD.x, GY + 116, 26, F.rise(span(ru, .4, 1)), { serif: false, weight: 700, spacing: .08, align: 'center' }); }
        // the town: the referee, his shadow and the ?, the rule book, the engineer
        const tw = span(t, A.town2, A.town2 + 1);
        if (tw > 0) {
          const sh = span(t, A.checkers - .1, A.checkers + 1.0) * (1 - span(t, A.mathOne, A.mathOne + 1.2));
          if (sh > 0) { cx.save(); cx.beginPath(); cx.rect(REFX - 200, GY - 400, 400, 400); cx.clip(); cx.translate(0, (1 - expoOut(sh)) * 200); cx.globalAlpha *= .75;
            E.person(cx, REFX + 60, GY, 150, { dir: -1, light: .15, look: .2 }); cx.restore();
            E.glowText(cx, '?', REFX + 60, GY - 168 - 10 * Math.sin(t * 1.4), { size: 70, serif: true, col: CREAM, a: sh, align: 'center' }); }
          F.referee(cx, t, REFX, GY, 82, { dir: -1, look: .25 + .3 * sh });
          B.ruleBook(cx, t, REFX - 110, GY, 74, span(t, A.mathOne - .1, A.mathOne + .9));
          const eh = E.person(cx, ENGX, GY, 64, { dir: -1, light: .9, look: .35, armR: [1.25, 1.95], long: true });
          if (eh?.R) { const run = span(t, A.engineer + .4, A.engineer + 2.6); B.laptop(cx, t, eh.R[0], eh.R[1] + 2, 15, run);
            const gc = span(t, A.nobodyTrust - .1, A.nobodyTrust + .6) * (1 - span(t, A.hardest, A.hardest + 1)); if (gc > 0) F.goldCard(cx, t, eh.R[0], eh.R[1] - 16, 22, { u: gc }); }
        }
        // ★ the bridges
        const eng = span(t, A.hardest + .5, A.hardest + 2.5);
        if (eng > 0) { const ex = S.BRIDGE.x - 95, ey = GY + 56; halo(cx, ex + 8, ey - 30, 46, .45 * eng, GOLD.halo, GOLD.core);
          const hd = E.person(cx, ex, ey, 40, { dir: 1, light: 1, look: .7, armR: [1.5, 2.3], long: true });
          if (hd?.R) { cx.fillStyle = PAPER.lit; cx.fillRect(hd.R[0] - 2, hd.R[1] - 10, 9, 12); } }
        if (youBridge && walk > 0) E.du(cx, yx, GY - 46, 30, { walk: yx / 7, view: 'side', look: .3 });
        B.newBridge(cx, t, span(t, A.until - .3, A.until + 1.7), 1);
      } });
    F.veil(ctx, Math.max(.62 * sineIO(span(t, A.town2 - .2, A.town2 + .7)) * (1 - sineIO(span(t, A.checkers - .7, A.checkers + .3))),
      .64 * sineIO(span(t, A.noneAgreed - .3, A.noneAgreed + .9)) * (1 - sineIO(span(t, A.si - 1.0, A.si + .6)))));
    // SHOW YOUR WORK (the town's form) while the camera travels to the town
    const fu = span(t, A.town2 - .1, A.town2 + .8) * (1 - span(t, A.checkers - .6, A.checkers + .1));
    if (fu > 0) { F.paperCard(ctx, t, 560, 250, 800, 380, { u: fu, head: 'TOWN HALL · BRIDGE VOTE', headSize: 24, lines: [[F.SOURCES.showWork, 76, 0, true]] });
      ctx.save(); ctx.globalAlpha *= clamp(fu * 3); ctx.strokeStyle = rgba(PAPER.ink, .8); ctx.lineWidth = 3; const by = 250 + (1 - expoOut(fu)) * 40; ctx.strokeRect(594, by + 250, 44, 44);
      E.glowText(ctx, 'NO CHECK, NO VOTE', 660, by + 284, { size: 28, weight: 600, spacing: .06, col: PAPER.faint, glow: false }); ctx.restore(); }
    tableScene(ctx, t, A);
    calendar(ctx, t, A);
    // labels in screen space
    const lab = span(t, A.oneWay + 1.0, A.oneWay + 1.8) * (1 - span(t, A.govts - .2, A.govts + .5)), pm = S.landPt(c, LABX[0] + 30, GY + 10);
    if (lab > 0 && pm) F.goldLabel(ctx, pm[0], pm[1], F.SOURCES.option, null, lab, { dx: -120, dy: -150, size: 26 });
    const lf = span(t, A.nonprofits - .2, A.nonprofits + .6) * (1 - span(t, A.hardest - .3, A.hardest + .4)), pf = S.landPt(c, REFX, GY - 60);
    if (lf > 0 && pf) F.goldLabel(ctx, pf[0], pf[1], F.SOURCES.leanFro, 'AN OPEN REFEREE', lf, { dx: 110, dy: -170, size: 26 });
    const crop = span(t, A.wang - .2, A.wang + 1.1) * (1 - span(t, A.how + .3, A.how + 1.4));
    if (crop > 0) F.xQuote(ctx, t, 'defaultPath', 80, 66, 1120, { u: crop, hiU: span(t, A.defPath - .05, A.defPath + .9) });
    const ny = span(t, A.howHum - .3, A.howHum + 1.0) * (1 - span(t, A.si - 1.5, A.si - .4));
    if (ny > 0) F.xQuote(ctx, t, 'nextYear', 330, 60, 1180, { u: ny, hiU: span(t, A.nextYear - .05, A.nextYear + .8) });
  }
  pane(ctx, t, A);
  F.checklist(ctx, t, T);
}
