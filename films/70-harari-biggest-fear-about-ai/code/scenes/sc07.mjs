// c07 · LINK 4 · TRUTH (builder B2) · 'Truth. The last link' → "Harari's own answer". One take; the Leitbild (ANCHOR 3/4) opens as a
// circle mask out of the HUD (the HUD links fly into the four named links), so no cut. Inner board of c06 continues (same view).
//
// | ID   | anchor (phrase)              | zeigt wörtlich                                                           | kind   | carrier out            |
// |------|------------------------------|--------------------------------------------------------------------------|--------|------------------------|
// | 6.01 | Truth. The last link         | the TRUTH link leaves your hand and grows big (HUD: LINK 4 · TRUTH)      | EXPL   | the link               |
// | 6.02 | The last link is             | inside it you weigh two options with your eye line: YOUR OWN JUDGMENT    | EXPL   | the link → HUD         |
// | 6.03 | An American poll             | the link shrinks into its HUD slot; a survey sheet slides in · Ipsos/NPR | EXPL   | four figures           |
// | 6.04 | Three in four said           | four figures: three turn to people, one to a screen · 75 %               | EXPL   | one figure walks       |
// | 6.05 | Now watch what people do     | she walks into an office: an analyst at her screen                       | SCENE  | her screen             |
// | 6.06 | A company that builds        | an agent panel opens out of her screen · Anthropic research, 50 analysts | MIX    | the panel              |
// | 6.07 | In secret, a coin flip       | behind the panel a coin spins and lands; option B lights                 | EXPL   | a bar                  |
// | 6.08 | Guess how often              | a bar grows, hesitates at a dashed 50 %                                  | EXPL   | the bar                |
// | 6.09★| Eighty-six percent           | the bar runs on to 86 % (gold)                                           | EXPL   | speech bubbles         |
// | 6.10 | Asked afterwards             | empty speech bubbles over the analysts: NONE OF 48 NOTICED               | EXPL   | a footnote             |
// | 6.11 | A caution                    | the footnote mark grows into a card: LIMITS                              | EXPL   | the card               |
// | 6.12 | It is one company's          | COMPANY STUDY · LEAN AMPLIFIED; the agent's dial turns up to full        | EXPL   | pull back              |
// | 6.13 | But it fits                  | pull back: the 86 bar becomes one bar of a wider board                   | EXPL   | a second bar           |
// | 6.14 | In a global survey           | chat bubble vs parliament, the second bar fills to 58 % · CIP            | EXPL   | the type               |
// | 6.15 | We say we trust              | WE SAY WE TRUST PEOPLE                                                   | EXPL   | line 2                 |
// | 6.16 | Then we follow               | THEN WE FOLLOW THE MACHINE; TRUTH cracks (HUD)                           | EXPL   | the HUD chain          |
// | 6.17 | Four links (W, by mask)      | ANCHOR 3/4: the HUD links fly into the chain over the night, all named   | ANCHOR | the cracks             |
// | 6.18 | Four cracks                  | the four cracks light one after the other                                | ANCHOR | the chain sways        |
// | 6.19 | Does the chain have          | the chain sways, you hold on tighter (camera glides to your hand)        | ANCHOR | the link in your hand  |
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f70_kit.mjs';
import * as S from '../lib/f70_world.mjs';
import * as X from '../lib/f70_explain.mjs';
import * as B from '../lib/b2_kit.mjs';
import { scene06 } from './sc06.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, LAMP, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT70;
const NONE48 = 'NONE OF 48 NOTICED';   // shots.md 6.10 (faktencheck S43: 48 answered the follow-up); not in F.SOURCES

// ---------------------------------------------------------------- ANCHOR 3/4: shared with c08 (its first frame matches the last one here)
export function leit07(T) {
  const four = T.G('Four links. Four cracks'), cracks = T.G('Four cracks', 0, four), brk = T.G('Does the chain have', 0, four);
  const HANDW = [S.YOU.x + 60, S.YOU.y - 150];
  const pushU = (t) => sineIO(span(t, brk - .3, brk + 2.9));
  const cam = (t) => { const k = pushU(t); return E.cam(lerp(1.08, 1.34, k), lerp(960, HANDW[0], k), lerp(600, HANDW[1], k), lerp(960, 600, k), lerp(600, 650, k)); };
  const st = (t) => {
    const k = pushU(t), hold = sineIO(span(t, brk + .2, brk + 1.4));
    const links = F.chainState(T, t).links.map((l, i) => ({ ...l, lit: .45 + .55 * Math.sin(Math.PI * span(t, cracks + i * .34, cracks + i * .34 + .7)) ** 2 }));
    const h = .06 * Math.sin(t * .8);
    return { four: 1, names: [1, 1, 1, 1], links, taut: lerp(.35, .8, hold), sway: lerp(7, 13, hold) - 5 * k,
      you: { o: { armR: [2.08 + h, 2.32 + h], armL: [lerp(-.25, 1.95, hold), lerp(-.15, 2.3, hold)], lean: -.05 * hold } } };
  };
  return { four, cracks, brk, cam, st };
}

export default async (T, R) => {
  const s6 = scene06(T, R), G = (p) => T.G(p, 0, R.a - .1);
  const A = {
    truth: R.a, last: G('The last link is'), poll: G('An American poll'), three: G('Three in four'), watch: G('Now watch what people do'),
    company: G('A company that builds'), secret: G('In secret, a coin'), guess: G('Guess how often'), e86: G('Eighty-six percent'),
    asked: G('Asked afterwards'), caution: G('A caution'), study: G("It is one company's"), purpose: G('turned up on purpose'),
    fits: G('But it fits'), global: G('In a global survey'), half: G('more than half'), weSay: G('We say we trust'), follow: G('Then we follow the machine'),
  };
  const L7 = leit07(T); A.four = L7.four;
  // ---------------------------------------------------------------- the view (inner board units), continuing c06's path
  const t0 = R.a + 1.7, V6 = s6.VI[s6.VI.length - 1][1];
  const VK = [[t0, V6], [A.poll - .1, { x: 5474, y: 560, s: 1.04 }], [A.poll + 2.0, { x: 6600, y: 560, s: 1 }], [A.watch - .1, { x: 6606, y: 560, s: 1 }],
    [A.watch + 2.0, { x: 8100, y: 560, s: 1 }], [A.e86 - .1, { x: 8098, y: 560, s: 1 }], [A.e86 + 1.3, { x: 8090, y: 555, s: 1.04 }],
    [A.fits - .1, { x: 8092, y: 553, s: 1.04 }], [A.fits + 1.8, { x: 8100, y: 420, s: .72 }], [A.weSay - 1.0, { x: 8102, y: 416, s: .72 }],
    [A.weSay + .6, { x: 8100, y: -700, s: 1 }], [A.four + 1.6, { x: 8100, y: -706, s: 1.02 }]];
  const view = (t) => (t < t0 ? s6.views(t).vi : X.viewPath(t, VK));

  // ---------------------------------------------------------------- 6.01–6.03: the TRUTH link (hand → big → HUD slot 4)
  const LF = { x: 5470, y: 470, L: 820 };
  const growU = (t) => sineIO(span(t, R.a + .05, R.a + 1.65)), toHud = (t) => sineIO(span(t, A.poll - .15, A.poll + 1.45));
  function truthLink(ctx, t, v) {   // screen space
    const k2 = toHud(t); if (k2 >= 1) return;
    let x, y, L, ang, lit;
    const hp = { ...HP0, ang: HP0.ang - .02 * Math.sin((R.a + .01) * .9) + .02 * Math.sin(t * .9) }, g = growU(t);
    const [fx, fy] = X.toScreen(v, LF.x, LF.y), [hx, hy] = X.toScreen(v, hp.lx, hp.ly);
    x = lerp(hx, fx, g); y = lerp(hy, fy, g) - Math.sin(Math.PI * g) * 40; L = Math.exp(lerp(Math.log(hp.L * v.s), Math.log(LF.L * v.s), g)); ang = lerp(hp.ang, 0, g); lit = lerp(hp.lit, .35, g);
    const sl = F.chainState(T, t).links[3], [ux, uy] = B.hudPos(3), hudLit = sl.lit * (.75 + .25 * Math.sin(t * 3));
    if (k2 > 0) { x = lerp(x, ux, k2); y = lerp(y, uy, k2); L = Math.exp(lerp(Math.log(L), Math.log(F.HUD.L), k2)); ang = lerp(ang, Math.sin(t * .9) * .03 + .04, k2); lit = lerp(lit, hudLit, k2); }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    F.chainLink(ctx, t, x, y, L, ang, { lit, crack: sl.crack });
    // inside the hole: you weigh two options with your eye line (6.02); scales with the link
    const iu = span(t, A.last - .3, A.last + .5) * (1 - span(k2, 0, .35));
    if (iu > 0) {
      const k = L / LF.L; ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(ang);
      ctx.save(); ctx.beginPath(); ctx.rect(-260, -260, 520, 360); ctx.clip();
      E.du(ctx, -150, 118 + (1 - expoOut(iu)) * 200, 170, { dir: 1, look: .15 + .08 * Math.sin(t * 1.2), light: 1 });
      ctx.restore();
      const sw = .5 + .5 * Math.sin((t - A.last) * 1.9 - 1.2), tx = lerp(70, 190, sw);
      B.option(ctx, 70, -30, 76, 54, 'A', { u: span(t, A.last + .2, A.last + .7), lit: .5 * (1 - sw) });
      B.option(ctx, 190, -30, 76, 54, 'B', { u: span(t, A.last + .3, A.last + .8), lit: .5 * sw });
      X.lightLine(ctx, [[-136, -26], [tx - 40, -24]], span(t, A.last + .6, A.last + 1.2), { w: 2.5, dash: [8, 9], a: .8, glowCol: LAMP.body });
    }
    ctx.restore();
  }
  const HP0 = s6.hand(createCanvas(4, 4).getContext('2d'), R.a + .01, { noLink: true });   // the link in your hand at the seam (c06 draws it)

  // ---------------------------------------------------------------- 6.03–6.05: survey, four figures, the walker
  const SV = { x: 6330, y: 520, w: 460, h: 540 }, FG = [6760, 6880, 7000, 7120], FY = 800, FH = 150, SCR = { x: 7330, y: 800 };
  const DK = { x: 7900, y: 800 };
  const walkX = (t) => lerp(FG[3], DK.x - 45, sineIO(span(t, A.watch + .05, A.watch + 2.15)));
  function survey(ctx, t) {
    if (t < A.poll || t > A.fits + 3) return;
    const su = expoOut(span(t, A.poll + .45, A.poll + 1.6)), x = lerp(7500, SV.x, su);
    if (su <= 0) return;
    B.sheet(ctx, x, SV.y, SV.w, SV.h, { rot: -.012 + (1 - su) * .05 });
    const tx = x - SV.w / 2 + 44, l1 = span(t, A.poll + 1.2, A.poll + 1.9);
    B.gold(ctx, [['WHOM DO YOU TRUST MORE?', 0]], tx, SV.y - SV.h / 2 + 80, 30, l1, { serif: true, col: PAPER.ink });
    const rows = [['PEOPLE YOU KNOW', A.three + .7], ['A MACHINE', A.three + 1.3]];
    rows.forEach(([txt, tk], i) => {
      const y = SV.y - 70 + i * 90, ru = span(t, A.poll + 1.5 + i * .15, A.poll + 2.1 + i * .15);
      ctx.save(); ctx.globalAlpha *= clamp(ru * 2); ctx.strokeStyle = rgba(PAPER.ink, .6); ctx.lineWidth = 2; ctx.strokeRect(tx, y - 26, 32, 32); ctx.restore();
      B.gold(ctx, [[txt, 0]], tx + 52, y, 24, ru, { serif: false, weight: 700, col: PAPER.ink, spacing: .08 });
      const ku = span(t, tk, tk + .4); if (ku > 0) F.goldSpan(ctx, [[tx + 6, y - 10], [tx + 14, y - 2], [tx + 28, y - 22]], 0, ku, { w: 2.2, spark: false, a: i ? .55 : 1 });
    });
    B.inkLines(ctx, tx, SV.y + 150, SV.w - 90, 3, span(t, A.poll + 1.8, A.poll + 2.6), { gap: 26, h: 5, col: rgba(PAPER.ink, .3) });
  }
  function figures(ctx, t) {
    if (t < A.three - .2 || t > A.fits + 3) return;
    for (let i = 0; i < 4; i++) {
      const u = expoOut(span(t, A.three + .1 + i * .08, A.three + .9 + i * .08)); if (u <= 0) continue;
      const toScreen = i === 3, x = toScreen && t > A.watch ? walkX(t) : FG[i];
      if (toScreen && t > A.watch + 2.15) continue;   // she is the analyst now (drawn by office)
      const walking = toScreen && t > A.watch + .05;
      ctx.save(); ctx.beginPath(); ctx.rect(x - 200, FY - 400, 400, 402); ctx.clip();
      E.person(ctx, x, FY + (1 - u) * FH * 1.1, FH, { dir: toScreen ? 1 : -1, light: toScreen ? lerp(.7, 1.15, span(t, A.watch, A.watch + 2.15)) : .7, look: .15 * Math.sin(t * .6 + i), rim: LAMP.body,
        view: toScreen ? 'side' : undefined, walk: walking ? (t - A.watch) * 7.5 : undefined, armR: walking ? undefined : [.15, .1], armL: walking ? undefined : [-.15, -.1] });
      ctx.restore();
    }
    const su = expoOut(span(t, A.three + .5, A.three + 1.3)) * (1 - sineIO(span(t, A.asked - .5, A.asked + .2)));   // sinks before the analysts take its place
    if (su > 0) { ctx.save(); ctx.beginPath(); ctx.rect(SCR.x - 200, SCR.y - 400, 400, 402); ctx.clip(); X.aiScreen(ctx, t, SCR.x, SCR.y - 60 + (1 - su) * 260, 130); ctx.restore(); }
    // the three lean to the warm side: a warm light at the left, under the sheet's first row
    const lu = span(t, A.three + .6, A.three + 1.4) * (1 - span(t, A.watch + 1, A.watch + 2));
    if (lu > 0) halo(ctx, 6880, 700, 260, .25 * lu, LAMP.body, LAMP.core);
    const n75 = 1 - span(t, A.watch, A.watch + .5);   // it sinks out before the view leaves
    if (n75 > 0) { ctx.save(); ctx.globalAlpha *= n75; F.numberRoll(ctx, 75, 6950, 420 + (1 - n75) * 40, 120, span(t, A.three + .15, A.three + 1.2), { fmt: (v) => Math.round(v) + '%', from: 0 }); ctx.restore(); }
    X.label(ctx, SRC.trust75.replace(/^75%\s*/, ''), 6950, 480, B.lab(t, A.three + .5, A.watch + .3), { size: 28, spacing: .12 });
  }

  // ---------------------------------------------------------------- 6.05–6.14: the office, the panel, the coin, the bars
  const PN = { x: 8230, y: 560, w: 280, h: 300 }, CO = { x: 8230, y: 365 }, BR = { x: 7450, y: 250, len: 800 }, BR2 = { y: 360 };
  const ANAL = [7330, 7440, 7550, 7660];
  function office(ctx, t) {
    if (t < A.watch || t > A.weSay + 1.2) return;
    const ou = span(t, A.watch + .6, A.watch + 1.6);
    // the analysts beside her (6.10) rise first so the desk covers them correctly
    for (let i = 0; i < ANAL.length; i++) {
      const u = expoOut(span(t, A.asked + .05 + i * .07, A.asked + .8 + i * .07)); if (u <= 0) continue;
      ctx.save(); ctx.beginPath(); ctx.rect(ANAL[i] - 150, FY - 400, 300, 402); ctx.clip();
      E.person(ctx, ANAL[i], FY + (1 - u) * 130, 120, { dir: 1, light: .6, look: .1 * Math.sin(t * .5 + i), rim: COOL.line, armR: [.9, 1.6], armL: [-.4, -.2] });
      ctx.restore();
      B.bubble(ctx, ANAL[i] + 10, FY - 132, 74, span(t, A.asked + .5 + i * .12, A.asked + 1.1 + i * .12));
    }
    // her: the walker stops behind the desk and works
    const wx = walkX(t), stop = span(t, A.watch + 1.7, A.watch + 2.3), sw = Math.sin((t - A.watch) * 7.5) * (1 - stop), type = sineIO(stop);
    if (t > A.watch + 2.15) {
      E.person(ctx, wx, FY, FH, { dir: 1, light: 1.15, look: -.15 + .08 * Math.sin(t * .7), rim: LAMP.body, view: 'side', walk: Math.PI,
        armR: [lerp(-.42 * sw, 1.25, type), lerp(-.42 * sw + .3, 2.0, type)], armL: [lerp(.42 * sw, 1.0, type), lerp(.42 * sw + .3, 1.8, type)] });
      B.bubble(ctx, wx + 10, FY - FH - 18, 80, span(t, A.asked + 1.0, A.asked + 1.6));
    }
    const dy = (1 - expoOut(ou)) * 140;
    ctx.save(); ctx.beginPath(); ctx.rect(DK.x - 400, FY - 600, 800, 602); ctx.clip(); ctx.translate(0, dy);
    B.deskLamp(ctx, DK.x - 130, FY - 74, 120, span(t, A.watch + 1.3, A.watch + 1.9));
    const mon = B.monitor(ctx, DK.x + 90, FY - 74, 150, { glow: .8 });
    B.desk(ctx, DK.x, FY, 320, 74);
    ctx.restore();
    // 6.06: the agent panel opens out of her screen
    const pu = sineIO(span(t, A.company + .15, A.company + 1.2));
    const po = 1 - span(t, A.fits + .2, A.fits + .9);   // the panel steps back for the second bar
    if (pu > 0 && po > 0) {
      ctx.save(); ctx.globalAlpha *= po;
      const mx = DK.x + 90, my = FY - 74 - 21 - 48, x = lerp(mx, PN.x, pu), y = lerp(my, PN.y, pu), w = lerp(135, PN.w, pu), h = lerp(86, PN.h, pu);
      ctx.save(); halo(ctx, x, y, w * .8, .2 * pu, COOL.halo, COOL.core);
      ctx.fillStyle = mixHex(P.night0, COOL.deep, .5); ctx.strokeStyle = rgba(COOL.line, .9); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 14); ctx.fill(); ctx.stroke(); ctx.restore();
      const cu = span(pu, .7, 1);
      X.label(ctx, 'AI AGENT', PN.x, PN.y - 100, cu, { size: 24, spacing: .16, col: COOL.text });
      const bl = span(t, A.secret + 2.6, A.secret + 3.1);
      B.option(ctx, PN.x, PN.y - 25, 200, 50, 'OPTION A', { u: cu, size: 22 });
      B.option(ctx, PN.x, PN.y + 40, 200, 50, 'OPTION B', { u: cu, size: 22, lit: bl });
      B.dial(ctx, PN.x, PN.y + 120, 28, lerp(.35, 1, sineIO(span(t, A.purpose - .1, A.purpose + .8))), span(t, A.study + .2, A.study + .7));
      ctx.restore();
    }
    // 6.07: the secret coin behind the panel
    const cu2 = span(t, A.secret + .1, A.secret + .6) * (1 - span(t, A.guess + .6, A.guess + 1.1)), flipU = span(t, A.secret + .5, A.secret + 2.6);
    if (cu2 > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(CO.x - 120, CO.y - 200, 240, PN.y - PN.h / 2 - (CO.y - 200)); ctx.clip();
      const yy = CO.y + (1 - expoOut(cu2)) * 120 - Math.sin(Math.PI * flipU) * 60;
      F.coin(ctx, t, CO.x, yy, 30, { flip: expoOut(flipU) * 7 });
      ctx.restore();
      X.label(ctx, 'SECRET COIN FLIP', CO.x - 70, CO.y + 10, B.lab(t, A.secret + .4, A.guess + .4), { size: 26, spacing: .14, align: 'right' });
    }
    // 6.08 / 6.09 / 6.13: the bars
    const bu = span(t, A.guess + .1, A.guess + .7);
    if (bu > 0) {
      const f1 = sineIO(span(t, A.guess + .3, A.guess + 2.1)) * .5 + (t < A.e86 ? .012 * Math.sin((t - A.guess) * 5) * span(t, A.guess + 1.9, A.guess + 2.3) : 0);
      const f2 = expoOut(span(t, A.e86 - .05, A.e86 + .7)), frac = lerp(f1, .86, f2), gold = span(t, A.e86 + .1, A.e86 + .6);
      B.bar(ctx, BR.x, BR.y, BR.len, 36, frac, { track: bu, col: mixHex(COOL.body, GOLD.body, gold) });
      if (gold > 0) halo(ctx, BR.x + BR.len * frac, BR.y, 110 * (1 + .6 * Math.sin(Math.PI * span(t, A.e86 + .1, A.e86 + .9))), .5 * gold, GOLD.halo, GOLD.core);
      ctx.save(); ctx.setLineDash([7, 8]); ctx.strokeStyle = rgba(CREAM, .7 * clamp(bu * 2) * (1 - span(t, A.fits - .2, A.fits + .3))); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(BR.x + BR.len / 2, BR.y - 40); ctx.lineTo(BR.x + BR.len / 2, BR.y + 34); ctx.stroke(); ctx.restore();
      X.label(ctx, '50%', BR.x + BR.len / 2, BR.y + 62, B.lab(t, A.guess + 1.2, A.fits + .1), { size: 26 });
      X.label(ctx, 'WENT WITH THE AGENT', BR.x, BR.y - 38, B.lab(t, A.guess + .3, A.weSay - .9), { size: 30, spacing: .12, align: 'left' });
      F.numberRoll(ctx, 86, BR.x + BR.len * .86 + 26, BR.y + 30, 96, span(t, A.e86 - .05, A.e86 + .9) * (1 - span(t, A.weSay - 1, A.weSay - .4)), { fmt: (v) => Math.round(v) + '%', from: 50, align: 'left' });
      // the footnote mark (6.11) and its card
      const fm = span(t, A.caution - .1, A.caution + .3), fc = sineIO(span(t, A.caution + .1, A.caution + 1.1)), fx = BR.x + BR.len * .86 + 160, fy = BR.y - 34;
      if (fm > 0 && fc < 1) B.big(ctx, '*', fx, fy + 10, 56, fm, { gold: .6 });
      const cardU = fc * (1 - span(t, A.fits - .3, A.fits + .3));
      if (cardU > 0) footCard(ctx, t, fx, fy, cardU);
      // 6.13–6.14: the second bar
      const b2 = span(t, A.fits + .3, A.fits + 1.3);
      if (b2 > 0) {
        const f58 = sineIO(span(t, A.half - .1, A.half + 1.4)) * .58;
        B.bar(ctx, BR.x, BR2.y, BR.len, 36, f58, { track: b2, dash: [10, 8], col: COOL.body });
        F.numberRoll(ctx, 58, BR.x + BR.len * f58 + 20, BR2.y - 34, 64, span(t, A.half - .1, A.half + 1.4), { fmt: (v) => Math.round(v) + '%', from: 0, align: 'left' });
        B.chatIcon(ctx, BR.x - 70, BR2.y, 70, span(t, A.global + .3, A.global + .9));
        B.parliament(ctx, BR.x + BR.len + 90, BR2.y + 34, 120, span(t, A.global + .6, A.global + 1.2));
        X.label(ctx, 'CHATBOTS OVER ELECTED REPRESENTATIVES', BR.x, BR2.y + 72, B.lab(t, A.global + .8, A.weSay - .9), { size: 34, spacing: .1, align: 'left' });
      }
    }
    B.big(ctx, NONE48, 7500, 560, 60, B.lab(t, A.asked + .8, A.caution + .2), { gold: .25 });
  }
  function footCard(ctx, t, fx, fy, u) {
    const w = 620, h = 170, cx = 8650, cy = 320, k = expoOut(u);
    const x = lerp(fx, cx, k), y = lerp(fy, cy, k), sc = lerp(.08, 1, k);
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.strokeStyle = rgba(GOLD.line, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 12); ctx.fill(); ctx.stroke();
    ctx.restore();
    if (k < .9) return;
    const [hd, l1, l2] = SRC.limits.split(' · ');
    X.label(ctx, '* ' + hd, cx - w / 2 + 30, cy - 42, span(t, A.caution + .7, A.caution + 1.2), { size: 26, align: 'left', gold: .8, spacing: .14 });
    X.label(ctx, l1, cx - w / 2 + 30, cy + 8, span(t, A.study + .1, A.study + .6), { size: 24, align: 'left', spacing: .1 });
    X.label(ctx, l2, cx - w / 2 + 30, cy + 52, span(t, A.purpose - .5, A.purpose + .1), { size: 24, align: 'left', spacing: .04 });
  }
  // ---------------------------------------------------------------- 6.15–6.16: the type
  function type(ctx, t) {
    if (t < A.weSay - 1.2) return;
    const out = (b) => 1 - span(t, A.four - .45, A.four + .0 + b);
    B.big(ctx, 'WE SAY WE TRUST PEOPLE', 8100, -770, 88, span(t, A.weSay - .05, A.weSay + .55) * out(0), { gold: .2 });
    B.big(ctx, 'THEN WE FOLLOW THE MACHINE', 8100, -630, 88, span(t, A.follow - .05, A.follow + .55) * out(.08), { gold: 0, col: COOL.core });
  }

  // ---------------------------------------------------------------- the take
  const MASK = [A.four - .15, A.four + 1.5], maskU = (t) => sineIO(span(t, MASK[0], MASK[1])), HC = [F.HUD.x + 1.5 * F.HUD.L * 1.02, F.HUD.y];
  function board(ctx, t) {
    const v = view(t);
    s6.base(ctx, t, { vi: v });
    X.inView(ctx, v, () => {
      if (t < R.a + 1.2) s6.hand(ctx, t, { out: span(t, R.a + .1, R.a + 1.1), noLink: true });
      survey(ctx, t); figures(ctx, t); office(ctx, t); type(ctx, t);
    });
    truthLink(ctx, t, v);
    X.inView(ctx, v, () => X.label(ctx, 'YOUR OWN JUDGMENT', 5470, 205, B.lab(t, A.last + .4, A.poll - .1), { size: 34, spacing: .16 }));
    return v;
  }
  function draw(ctx, t) {
    const m = maskU(t);
    if (m < 1) board(ctx, t);
    let w = null;
    if (t >= MASK[0]) {
      const r = m ** .9 * 2050 + 1;
      ctx.save(); if (m < 1) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(HC[0], HC[1], r, 0, Math.PI * 2); ctx.clip(); }
      w = S.chainWorld(ctx, t, L7.cam(t), L7.st(t));
      ctx.restore();
    }
    // the HUD: slot 4 empty while its link is big; at the point it flies into the four named links (the carrier into the anchor)
    const k2 = toHud(t), fl = sineIO(span(t, MASK[0] - .05, MASK[1] - .1));
    if (t < MASK[0]) B.hud(ctx, t, T);
    else if (w && fl < 1) {
      const nm = w.named, ang = (i) => { const a = nm[Math.max(0, i - 1)], b = nm[Math.min(3, i + 1)]; return Math.atan2(b[1] - a[1], b[0] - a[0]); };
      const la = 1 - span(fl, .75, 1);
      B.hud(ctx, t, T, { on: 1, f: fl, label: false, la: [la, la, la, la], ea: 1 - span(fl, .3, .7),
        to: (i) => ({ x: nm[i][0], y: nm[i][1], L: nm[i][2], ang: ang(i) }),
        toE: (i) => ({ x: (nm[i][0] + nm[i + 1][0]) / 2, y: (nm[i][1] + nm[i + 1][1]) / 2, L: nm[i][2] * .5, ang: ang(i) }),
        lit: L7.st(t).links.map((l) => l.lit) });
    }
    if (m < 1) {
      F.source(ctx, t, A.poll + .6, A.watch + .2, SRC.ipsos);
      F.source(ctx, t, A.company + .4, A.fits - .2, SRC.anthropic);
      F.source(ctx, t, A.global + .4, A.weSay - .6, SRC.cip);
    }
  }
  return [{ t: R.a, draw, print: PR }];
};
