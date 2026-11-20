// c11 · B3 · THREE ANSWERS · three tags of light split off the half promise's face (its second half: "enough money") and hang in a row:
// MARKET · FUND · CHECK; each answer lights its tag, its proof rises under it, its weakness follows · MARKET dips (prices fall), the
// seventh tag comes down beside it and falls with it · FUND: the American Equity Fund (2021), 2.5 % + 2.5 % · ALASKA ★: a lit window of
// the land (the barn door) opens into a kitchen table, the payment slides across it, $1,200 IN 2026 · his plan ≈ $13,500 · the window goes
// back; 2022 $3,284 vs 2026 $1,200, set by the legislature · CHECK: $1,000 a month, 1.3 fewer hours · the bill: a long receipt unrolls from
// the town hall · his answers changed: a short timeline (no mockery). Behind the veil the camera travels from the promise to the town hall.
// So how does everyone → So that's the order. Plan: docs/shots.md 10.01–10.08. Part of the B3 take (scenes/sc09.mjs: b3()).
//
// | ID     | anchor (phrase)                | picture (one idea)                                                                  | camera            |
// |--------|--------------------------------|-------------------------------------------------------------------------------------|-------------------|
// | 10.01  | So how does everyone           | three tags split off the promise's face: MARKET · FUND · CHECK (a row, top right)    | creep · MIX       |
// | 10.02  | The first is the market        | MARKET lit, dips; SMARTPHONES −51 %; the seventh tag falls with it                  | travel (veil) · EXPL |
// | 10.03  | The second is a fund           | FUND lit: AMERICAN EQUITY FUND (2021) 2.5 % of companies, 2.5 % of land             | travel · EXPL     |
// | 10.04★ | Alaska already pays            | the barn door opens into a kitchen table, the payment arrives: $1,200 IN 2026; ≈ $13,500 | creep · MIX   |
// | 10.05  | Its weakness: a fund pays      | 2022 $3,284 · 2026 $1,200 (bars); SET BY THE LEGISLATURE EACH YEAR                  | travel · EXPL     |
// | 10.06  | The third is a check           | CHECK lit: OPENRESEARCH STUDY · $1,000 A MONTH · 1.3 FEWER WORKING HOURS A WEEK     | travel · EXPL     |
// | 10.07  | Its weakness is the bill       | the bill: a long receipt unrolls from the town hall (veil low)                       | creep · MIX       |
// | 10.08  | Even Altman has changed        | timeline: CASH STUDY · 2021 FUND · 2024 UBC · 2026 PUBLIC WEALTH FUND               | creep · EXPL      |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f66_kit.mjs';
import * as S from '../lib/f66_world.mjs';
import { b3, PRINT, CL, PL, panel, caps, big, faceAt } from './sc09.mjs';
import { PROM } from './sc10.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, mixHex } = E;
const { rise, GOLD, PAPER, COOL, LAMP, EARTH } = F;

export default async (T, R) => [{ t: R.a, draw: b3(T).draw, print: PRINT }];

export function anchors(a, G) {
  a.howAll = G('So how does everyone'); a.three = G('Three answers are on the table', a.howAll); a.market = G('The first is the market', a.three);
  a.fall = G('let prices fall', a.market); a.phone = G('It worked for your phone', a.market); a.mWeak = G('Its weakness is the seventh tag', a.market);
  a.wagesFall = G('wages can fall right along', a.mWeak); a.fund = G('The second is a fund', a.mWeak); a.owns = G('everyone owns a share', a.fund);
  a.plan = G("That was Altman's plan", a.fund); a.bigCo = G('big companies', a.plan); a.andLand = G('and land', a.bigCo);
  a.alaska = G('Alaska already pays', a.fund); a.twelve = G('twelve hundred dollars', a.alaska); a.ten = G('His plan imagined more than ten times', a.alaska);
  a.fWeak = G('Its weakness: a fund pays', a.alaska); a.lawmakers = G("Alaska's lawmakers", a.fWeak); a.check = G('The third is a check', a.fWeak);
  a.testC = G('Altman backed a test', a.check); a.thousand = G('a thousand dollars a month', a.testC); a.less = G('worked a little less', a.thousand);
  a.bill = G('Its weakness is the bill', a.check); a.changed = G('Even Altman has changed', a.bill);
}
const SLOT = [['MARKET', 780], ['FUND', 1080], ['CHECK', 1380]].map(([label, x]) => ({ label, x, y: 92, w: 118 }));
const BARN = { x: 5046, y: S.GY - 96, w: 48, h: 96 };     // the barn's lit door (land px): Alaska's kitchen window grows out of it
const WIN = { x: 170, y: 300, w: 780, h: 520 };          // the kitchen window, open (screen)
const HALL = { x: 6600, y: S.GY - 284 };                 // the town hall's dome (land px): the bill unrolls from it
const TL = [['', 'CASH STUDY', 330], ['2021', 'FUND OF SHARES AND LAND', 760], ['2024', '“UNIVERSAL BASIC COMPUTE”', 1190], ['2026', 'PUBLIC WEALTH FUND', 1590]];

// Alaska: a family at the kitchen table (faceless silhouettes behind the table), the lamp, the window to the snow; the payment slides in
function kitchen(ctx, t, a, w, h) {
  const k = w / WIN.w; ctx.save(); ctx.scale(k, h / WIN.h);
  const ww = WIN.w, hh = WIN.h;
  ctx.fillStyle = E.lin(ctx, 0, 0, 0, hh, [[0, mixHex(GOLD.deep, P.night1, .45)], [.6, mixHex(GOLD.deep, LAMP.body, .3)], [1, mixHex(GOLD.deep, P.night0, .45)]]); ctx.fillRect(0, 0, ww, hh);
  // the window to Alaska: night, a snowy ridge, falling snow
  const wx = 470, wy = 60, w2 = 230, h2 = 150;
  ctx.fillStyle = E.lin(ctx, 0, wy, 0, wy + h2, [[0, P.night0], [1, mixHex(P.ind1, P.blue0, .4)]]); ctx.fillRect(wx, wy, w2, h2);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, w2, h2); ctx.clip();
  ctx.fillStyle = mixHex(P.cream, P.blue1, .55); ctx.beginPath(); ctx.moveTo(wx, wy + h2); ctx.lineTo(wx + 50, wy + 92); ctx.lineTo(wx + 95, wy + 112); ctx.lineTo(wx + 150, wy + 70); ctx.lineTo(wx + w2, wy + 104); ctx.lineTo(wx + w2, wy + h2); ctx.closePath(); ctx.fill();
  const r = E.prng(912); for (let i = 0; i < 26; i++) { const sx = wx + r() * w2, sp = 12 + r() * 14, sy = wy + ((r() * h2 + t * sp) % h2); ctx.fillStyle = rgba(P.cream, .7); ctx.fillRect(sx + 4 * Math.sin(t + i), sy, 2.4, 2.4); }
  ctx.restore();
  ctx.strokeStyle = mixHex(LAMP.deep, P.night0, .5); ctx.lineWidth = 8; ctx.strokeRect(wx, wy, w2, h2); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(wx + w2 / 2, wy); ctx.lineTo(wx + w2 / 2, wy + h2); ctx.stroke();
  // the lamp over the table (the warm light of the room)
  ctx.strokeStyle = P.night0; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(330, 0); ctx.lineTo(330, 120); ctx.stroke();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.moveTo(296, 150); ctx.lineTo(364, 150); ctx.lineTo(344, 118); ctx.lineTo(316, 118); ctx.closePath(); ctx.fill();
  E.halo(ctx, 330, 160, 260, .32 + .02 * Math.sin(t * 1.3), GOLD.halo, LAMP.core);
  // the family behind the table (three faceless people; the table hides their legs)
  const pay = sineIO(span(t, a.twelve - .5, a.twelve + .9));
  E.person(ctx, 150, 470, 250, { dir: 1, light: 1, look: .1 + .25 * pay, lean: .05 });
  E.person(ctx, 330, 478, 210, { dir: 1, light: .6, look: .2 + .2 * pay, long: true });
  E.person(ctx, 540, 470, 250, { dir: -1, light: -1, look: .15 + .2 * pay, lean: .06 });
  ctx.fillStyle = mixHex(EARTH.deep, P.night0, .3); ctx.fillRect(40, 370, 680, 22);
  ctx.fillStyle = E.lin(ctx, 0, 392, 0, hh, [[0, mixHex(EARTH.body, GOLD.deep, .35)], [1, mixHex(EARTH.deep, P.night0, .4)]]); ctx.fillRect(52, 392, 656, hh - 392);   // the tablecloth hides the legs (they sit)
  ctx.fillStyle = rgba(GOLD.hot, .25); ctx.fillRect(40, 370, 680, 3);
  // the payment: slides across the table from the right into the middle, glowing (the hero light)
  F.paySlip(ctx, t, lerp(760, 360, expoOut(pay)), 352, 120, { glow: pay, rot: lerp(.25, -.05, pay), label: 'DIVIDEND', a: clamp(pay * 4) });
  ctx.restore();
}

export function layer(a, T) {
  const fly = (i, t) => sineIO(span(t, a.howAll + .35 + i * .38, a.howAll + 1.6 + i * .38));
  const outT = (i, t) => expoIn(span(t, a.changed + 2.4 + i * .12, a.changed + 3.9 + i * .12));
  const winM = (t) => sineIO(span(t, a.alaska - .4, a.alaska + 1.5)) * (1 - sineIO(span(t, a.fWeak - .2, a.fWeak + 1.6)));
  const rcU = (t) => sineIO(span(t, a.bill - .15, a.bill + 1.7)) * (1 - sineIO(span(t, a.changed + 3.0, a.changed + 6.5)));
  return {
    keys: [
      [a.three + 1.0, PROM(1.08, 30)],
      [a.market + .4, PROM(1.09, 40)],
      [a.alaska - .9, CL(4920, 700, 1.1, 960, 540)],
      [a.fWeak + 2.2, CL(5020, 700, 1.15, 960, 540)],
      [a.bill - .7, CL(6380, 700, 1.15, 960, 560)],
      [a.changed + 3.0, CL(6330, 700, 1.17, 960, 560)],
    ],
    veil(t) {
      if (t < a.market - .5) return 0;
      const v = .8 * sineIO(span(t, a.market - .5, a.market + 1.4));
      const low = lerp(1, .3 / .8, sineIO(span(t, a.bill + .1, a.bill + 1.2))), tl = .82 * sineIO(span(t, a.changed - .3, a.changed + .7));
      return Math.max(v * low, tl) * (1 - span(t, a.changed + 5.5, a.changed + 7));
    },
    under(ctx, t, c) {
      // 10.07: the bill, a long receipt from the town hall's dome down to the ground
      const u = rcU(t); if (u <= 0) return;
      const f = PL(c, HALL.x, HALL.y), to = PL(c, HALL.x - 520, S.GY - 10);
      if (f && to) F.receipt(ctx, t, { from: [f[0], f[1]], to: [to[0], to[1]], u, w: 120 * f[2], bend: .7, rows: [], roll: 1 });
    },
    over(ctx, t, c) {
      // 10.04 ★: the kitchen window grows out of the barn's lit door (world-attached at both ends of its move)
      const m = winM(t);
      if (m > 0) {
        const d = PL(c, BARN.x, BARN.y), k = d ? d[2] : 1, src = d ? { x: d[0], y: d[1], w: BARN.w * k, h: BARN.h * k } : { x: W / 2, y: H / 2, w: 40, h: 80 };
        const x = lerp(src.x, WIN.x, m), y = lerp(src.y, WIN.y, m), w = lerp(src.w, WIN.w, m), h = lerp(src.h, WIN.h, m);
        E.halo(ctx, x + w / 2, y + h / 2, Math.max(w, h) * .7, .18 * m, GOLD.halo, LAMP.core);
        ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 6 + 6 * m); ctx.clip(); ctx.translate(x, y); kitchen(ctx, t, a, w, h); ctx.restore();
        ctx.strokeStyle = rgba(LAMP.core, .8); ctx.lineWidth = 2 + m; ctx.beginPath(); ctx.roundRect(x, y, w, h, 6 + 6 * m); ctx.stroke();
      }
      F.float(ctx, t, .5);
      // the three tags (screen): out of the promise's face on an arc into their slots
      const f0 = faceAt(c);
      SLOT.forEach((s, i) => {
        const f = fly(i, t), o = outT(i, t); if (f <= 0 || o >= 1) return;
        const fx = f0 ? f0[0] : 1100, fy = f0 ? f0[1] : 400;
        const x = lerp(fx, s.x, f), w = lerp(34, s.w, sineIO(f));
        let y = lerp(fy, s.y, f) - 170 * Math.sin(Math.PI * f) - 700 * o;
        if (i === 0) y += 26 * sineIO(span(t, a.fall - .1, a.fall + .9)) + 60 * expoOut(span(t, a.wagesFall + .1, a.wagesFall + 1.1)) - 20 * span(t, a.fund, a.fund + 1.5);
        const st = [a.market, a.fund, a.check], en = [a.fund, a.check, a.changed + 2];
        const on = smooth(span(t, st[i] - .3, st[i] + .5)) * (1 - smooth(span(t, en[i] - .3, en[i] + .5))), pre = .7 - .28 * smooth(span(t, a.market - .3, a.market + .5));
        F.tag(ctx, t, x, y, w, { thread: 900 * f, glow: lerp(pre, 1, on), seed: 300 + i,
          swing: (1 - f) * .5 + .04 * F.bump(t, a.fall, 1) * Math.sin(t * 6) * (i === 0 ? 1 : 0), dust: i === 0 ? .2 * span(t, a.wagesFall, a.wagesFall + 1.4) : 0,
          lines: [[s.label, 21, 0, false]], textU: span(f, .6, 1) });
      });
      // 10.02: the seventh tag comes down beside MARKET and falls with it
      const sd = span(t, a.mWeak - .1, a.mWeak + 1.2), sup = expoIn(span(t, a.fund - .2, a.fund + 1.2));
      if (sd > 0 && sup < 1) {
        const y = 110 - 560 * (1 - expoOut(sd)) + 64 * expoOut(span(t, a.wagesFall + .15, a.wagesFall + 1.15)) - 700 * sup;
        F.tag(ctx, t, 646, y, 70, { thread: 900, glow: .55, seed: 26, swing: .05 * Math.sin(t * 2.1), dust: .25 * span(t, a.wagesFall + .2, a.wagesFall + 1.6),
          lines: [['YOUR', 13, 0, false], ['WAGE', 13, 0, false]] });
      }
      // 10.02: proof: your phone
      const pu = span(t, a.phone - .2, a.phone + .7) * (1 - span(t, a.mWeak + .6, a.mWeak + 1.4));
      if (pu > 0) F.dataCard(ctx, t, 560, 360, 800, { u: pu, h: 270, title: 'SMARTPHONES · IN FIVE YEARS', big: '−51 %', small: 'QUALITY-ADJUSTED' });
      // 10.03: the fund (everyone owns a share)
      const fu = span(t, a.owns - .25, a.owns + .7) * (1 - span(t, a.alaska - .3, a.alaska + .5));
      if (fu > 0) {
        panel(ctx, t, 560, 360, 800, 360, fu, { head: 'AMERICAN EQUITY FUND (2021)' });
        const oy = (1 - expoOut(fu)) * 40; ctx.save(); ctx.translate(0, oy); ctx.globalAlpha *= clamp(fu * 3);
        // "everyone owns a share": a row of people, each holds a small gold tag (a share); they sink when the two numbers come
        const pu = span(t, a.owns - .1, a.owns + 1.0) * (1 - span(t, a.bigCo - 1.3, a.bigCo - .5));
        if (pu > 0) {
          ctx.save(); ctx.beginPath(); ctx.rect(570, 420, 780, 292); ctx.clip();
          for (let i = 0; i < 8; i++) {
            const k = clamp(pu * 1.6 - i * .08), x = 640 + i * 92, y = 700 + (1 - expoOut(k)) * 170, dir = i % 2 ? -1 : 1;
            const hd = E.person(ctx, x, y, 150, { dir, light: dir, armR: [.9, 1.9], look: .15 });
            if (hd?.R) F.tag(ctx, t, hd.R[0], hd.R[1] - 6, 24, { thread: 0, glow: .75, seed: 400 + i, swing: .06 * Math.sin(t * 1.3 + i) });
          }
          ctx.restore();
        }
        big(ctx, '2.5 %', 600, 520, 66, span(t, a.bigCo - .1, a.bigCo + .7));
        caps(ctx, 'OF LARGE COMPANIES’ VALUE, PAID IN SHARES', 760, 512, span(t, a.bigCo, a.bigCo + .8));
        big(ctx, '2.5 %', 600, 640, 66, span(t, a.andLand - .1, a.andLand + .7));
        caps(ctx, 'OF LAND VALUE', 760, 632, span(t, a.andLand, a.andLand + .8));
        ctx.restore();
      }
      // 10.04 ★: $1,200 IN 2026 · his plan ≈ $13,500
      const nOut = span(t, a.fWeak - .3, a.fWeak + .4);
      if (t > a.twelve - .2 && nOut < 1) {
        const o = 1 - nOut;
        big(ctx, '$1,200 IN 2026', 1010, 470, 82, span(t, a.twelve - .1, a.twelve + .8) * o);
        caps(ctx, F.SOURCES.alaskaSub, 1014, 518, span(t, a.twelve + .3, a.twelve + 1.1) * o, { col: P.halo2 });
        big(ctx, '≈ $13,500', 1010, 640, 62, span(t, a.ten + .4, a.ten + 1.2) * o, { gold: .55, glow: false });
        caps(ctx, 'ALTMAN’S ESTIMATE (2021), A YEAR PER ADULT', 1014, 684, span(t, a.ten + .6, a.ten + 1.4) * o, { col: P.halo2 });
      }
      // 10.05: what politics allows: 2022 vs 2026
      const wu = span(t, a.fWeak + .5, a.fWeak + 1.4) * (1 - span(t, a.check - .3, a.check + .5));
      if (wu > 0) {
        panel(ctx, t, 560, 340, 800, 470, wu, { head: 'ALASKA, PER RESIDENT' });
        const oy = (1 - expoOut(wu)) * 40, base = 690; ctx.save(); ctx.translate(0, oy); ctx.globalAlpha *= clamp(wu * 3);
        const g1 = expoOut(span(t, a.fWeak + .9, a.fWeak + 2.0)), g2 = expoOut(span(t, a.fWeak + 1.4, a.fWeak + 2.4));
        ctx.fillStyle = mixHex(GOLD.mid, P.night1, .35); ctx.fillRect(660, base - 220 * g1, 150, 220 * g1);
        ctx.fillStyle = GOLD.body; ctx.fillRect(1000, base - 220 * 1200 / 3284 * g2, 150, 220 * 1200 / 3284 * g2);
        big(ctx, '$3,284', 735, base - 220 * g1 - 18, 46, span(g1, .4, 1), { align: 'center', gold: .3, glow: false });
        big(ctx, '$1,200', 1075, base - 80 * g2 - 18, 46, span(g2, .4, 1), { align: 'center' });
        caps(ctx, '2022', 735, base + 36, span(g1, .2, 1), { align: 'center' }); caps(ctx, '2026', 1075, base + 36, span(g2, .2, 1), { align: 'center' });
        caps(ctx, F.SOURCES.alaskaPolSub, 600, 776, span(t, a.lawmakers + .1, a.lawmakers + .9), { gold: .7, weight: 700 });
        ctx.restore();
      }
      // 10.06: the check
      const cu = span(t, a.check + 1.2, a.check + 2.1) * (1 - sineIO(span(t, a.bill - .5, a.bill + .3)));
      if (cu > 0) {
        panel(ctx, t, 560, 360, 800, 360, cu, { head: 'OPENRESEARCH STUDY · 2020–2023' });
        const oy = (1 - expoOut(cu)) * 40; ctx.save(); ctx.translate(0, oy); ctx.globalAlpha *= clamp(cu * 3);
        caps(ctx, '1,000 PEOPLE · 3 YEARS', 600, 470, span(cu, .3, 1));
        big(ctx, '$1,000 A MONTH', 598, 570, 76, span(t, a.thousand - .1, a.thousand + .8));
        caps(ctx, F.SOURCES.checkSub, 600, 660, span(t, a.less - .1, a.less + .7), { gold: .8, weight: 700 });
        ctx.restore();
      }
      // 10.08: his answers changed (a short timeline, no mockery)
      const tu = span(t, a.changed - .2, a.changed + .6) * (1 - span(t, a.changed + 4.3, a.changed + 5.2));
      if (tu > 0) {
        const y = 560;
        F.goldSpan(ctx, [[250, y], [1680, y]], 0, smooth(span(t, a.changed - .1, a.changed + 1.3)) * (1 - span(t, a.changed + 4.3, a.changed + 5.2)), { w: 1.3, spark: false });
        TL.forEach(([yr, lab, x], i) => {
          const u = span(t, a.changed + .2 + i * .3, a.changed + .9 + i * .3) * (1 - span(t, a.changed + 4.2, a.changed + 4.9));
          if (u <= 0) return;
          ctx.fillStyle = rgba(GOLD.core, u); ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill();
          if (yr) big(ctx, yr, x, y - 26, 46, u, { align: 'center', gold: .9, glow: false });
          caps(ctx, lab, x, y + 46, u, { align: 'center' });
        });
      }
    },
    top(ctx, t) {
      F.source(ctx, t, a.phone + .3, a.mWeak + 1.2, F.SOURCES.phonesSrc);
      F.source(ctx, t, a.owns + .4, a.alaska - .4, F.SOURCES.fundSrc);
      F.source(ctx, t, a.twelve + .3, a.fWeak + .3, 'ALASKA DEPT. OF REVENUE, PERMANENT FUND DIVIDEND DIVISION · ALTMAN, “MOORE’S LAW FOR EVERYTHING” (2021)');
      F.source(ctx, t, a.fWeak + 1.2, a.check - .4, 'ALASKA DEPT. OF REVENUE, PERMANENT FUND DIVIDEND DIVISION');
      F.source(ctx, t, a.check + 1.8, a.bill - .4, 'OPENRESEARCH UNCONDITIONAL INCOME STUDY · 1,000 PEOPLE · $1,000 A MONTH · 2020–2023');
    },
  };
}
